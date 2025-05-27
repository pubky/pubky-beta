'use client';

import { Button, Icon, SideCard } from '@social/ui-shared';
import { useFilterContext, useModal, usePubkyClientContext } from '@/contexts';
import { ICustomFeed } from '@/types';
import { useEffect, useState } from 'react';
import { Utils } from '@social/utils-shared';

export default function Feeds() {
  const { reach, setReach, setSort, setContent, setLayout, selectedFeed, setSelectedFeed } = useFilterContext();
  const { openModal } = useModal();
  const [feeds, setFeeds] = useState<{ feed: ICustomFeed; name: string }[]>();
  const [isLoading, setIsLoading] = useState(true);
  const { loadFeeds, deleteFeed } = usePubkyClientContext();

  const updateFeed = (feedToUpdate: ICustomFeed | null, name: string, originalFeed: ICustomFeed) => {
    if (feedToUpdate === null) {
      // Handle feed deletion
      setFeeds((prevFeeds) => prevFeeds.filter((f) => JSON.stringify(f.feed) !== JSON.stringify(originalFeed)));
      if (selectedFeed === originalFeed) {
        setSelectedFeed(undefined);
      }
    } else {
      // Handle feed update
      setFeeds((prevFeeds) =>
        prevFeeds.map((f) =>
          JSON.stringify(f.feed) === JSON.stringify(originalFeed) ? { feed: feedToUpdate, name } : f
        )
      );
    }
  };

  useEffect(() => {
    handleLoadFeeds();
  }, []);

  const handleLoadFeeds = async () => {
    try {
      setIsLoading(true);
      const result = await loadFeeds();
      setFeeds(result);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedFeed) {
      Utils.storage.set('feed', selectedFeed);
    } else {
      Utils.storage.remove('feed');
    }
  }, [selectedFeed]);

  const handleFeedSelect = (feed: ICustomFeed) => {
    setSelectedFeed(feed);
    Utils.storage.set('feed', feed);
  };

  const handleDeleteFeed = async (feedToDelete: ICustomFeed) => {
    await deleteFeed(feedToDelete);
    if (selectedFeed === feedToDelete) {
      setSelectedFeed(undefined);
    }
    setFeeds((prevFeeds) => prevFeeds?.filter((feed) => JSON.stringify(feed.feed) !== JSON.stringify(feedToDelete)));
  };

  const handleForYouClick = () => {
    setSelectedFeed(undefined);
    Utils.storage.remove('feed');
    setReach('all');
    setSort('recent');
    setContent('all');
    setLayout('columns');
  };

  return (
    <div className="7">
      <SideCard.Header title="Feeds" className="mb-2" />
      <div>
        <SideCard.Item
          label={reach.charAt(0).toUpperCase() + reach.slice(1)}
          value={reach}
          selected={!selectedFeed}
          onClick={handleForYouClick}
          icon={<Icon.Activity size="24" />}
        />
        {isLoading ? (
          <div className="flex justify-center items-center py-4">
            <Icon.LoadingSpin size="24" />
          </div>
        ) : (
          feeds?.map((feed, index) => {
            return (
              <div className="flex w-full gap-4 justify-between" key={`${index}/${feed.name}`}>
                <SideCard.Item
                  label={Utils.minifyText(feed.name, 11) as string}
                  value={feed.name}
                  selected={JSON.stringify(selectedFeed) === JSON.stringify(feed.feed)}
                  onClick={() => handleFeedSelect(feed.feed)}
                  icon={<Icon.Activity size="24" />}
                />
                <div
                  onClick={() => {
                    openModal('editFeed', {
                      handleUpdateFeeds: (updatedFeed: ICustomFeed | null, name: string) =>
                        updateFeed(updatedFeed, name, feed.feed),
                      feedToEdit: feed.feed,
                      feedName: feed.name
                    });
                  }}
                  className="cursor-pointer opacity-50 hover:opacity-80 mt-2"
                >
                  <Icon.Pencil size="16" />
                </div>
              </div>
            );
          })
        )}
        <Button.Medium
          onClick={() => openModal('createFeed', { handleLoadFeeds })}
          className="mt-4"
          icon={<Icon.Plus size="16" />}
        >
          New feed
        </Button.Medium>
      </div>
    </div>
  );
}
