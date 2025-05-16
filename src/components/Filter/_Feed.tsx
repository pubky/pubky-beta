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
  const { loadFeeds, deleteFeed } = usePubkyClientContext();

  const updateFeed = (feedToUpdate: ICustomFeed | null, name: string, originalFeed: ICustomFeed) => {
    if (feedToUpdate === null) {
      // Handle feed deletion
      setFeeds((prevFeeds) => prevFeeds.filter((f) => f.feed.created_at !== originalFeed.created_at));
      if (selectedFeed?.created_at === originalFeed.created_at) {
        setSelectedFeed(undefined);
      }
    } else {
      // Handle feed update
      setFeeds((prevFeeds) =>
        prevFeeds.map((f) => (f.feed.created_at === originalFeed.created_at ? { feed: feedToUpdate, name } : f))
      );
    }
  };

  useEffect(() => {
    handleLoadFeeds();
  }, []);

  const handleLoadFeeds = async () => {
    try {
      const result = await loadFeeds();
      setFeeds(result);
    } catch (error) {
      console.log(error);
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
    if (selectedFeed?.created_at === feedToDelete.created_at) {
      setSelectedFeed(undefined);
    }
    setFeeds((prevFeeds) => prevFeeds?.filter((feed) => feed.feed.created_at !== feedToDelete.created_at));
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
        {feeds?.map((feed, index) => {
          return (
            <div className="flex w-full gap-4 justify-between" key={`${feed.feed.created_at}/${feed.name}`}>
              <SideCard.Item
                label={Utils.minifyText(feed.name, 11) as string}
                value={feed.name}
                selected={selectedFeed?.created_at === feed.feed.created_at}
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
        })}
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
