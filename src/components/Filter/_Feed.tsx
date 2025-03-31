'use client';

import { Button, Icon, SideCard } from '@social/ui-shared';
import { useFilterContext, useModal, usePubkyClientContext } from '@/contexts';
import { ICustomFeed } from '@/types';
import { useEffect, useState } from 'react';
import { Utils } from '@social/utils-shared';

export default function Feeds() {
  const { reach, selectedFeed, setSelectedFeed } = useFilterContext();
  const { openModal } = useModal();
  const [feeds, setFeeds] = useState<{ feed: ICustomFeed; name: string }[]>();
  const { loadFeeds, deleteFeed } = usePubkyClientContext();

  useEffect(() => {
    handleLoadFeeds();
  }, []);

  const handleLoadFeeds = async () => {
    try {
      const result = await loadFeeds();
      setFeeds(result);

      const storedFeed = Utils.storage.get('feed');
      if (storedFeed) {
        const matchingFeed = result.find((feed) => JSON.stringify(feed.feed) === JSON.stringify(storedFeed));
        if (matchingFeed) {
          setSelectedFeed(matchingFeed.feed);
        } else {
          setSelectedFeed(undefined);
          Utils.storage.remove('feed');
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  useEffect(() => {
    if (selectedFeed) {
      Utils.storage.set('feed', selectedFeed);
    }
  }, [selectedFeed]);

  const handleFeedSelect = (feed: ICustomFeed) => {
    setSelectedFeed(feed);
  };

  const handleDeleteFeed = async (feedToDelete: ICustomFeed) => {
    await deleteFeed(feedToDelete);
    if (selectedFeed === feedToDelete) {
      setSelectedFeed(undefined);
    }
    handleLoadFeeds();
  };

  const handleForYouClick = () => {
    setSelectedFeed(undefined);
    Utils.storage.remove('feed');
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
            <div className="flex w-full gap-4 justify-between" key={`${index}/${feed.name}`}>
              <SideCard.Item
                label={String(Utils.minifyText(feed.name, 11))}
                value={feed.name}
                selected={JSON.stringify(selectedFeed) === JSON.stringify(feed.feed)}
                onClick={() => handleFeedSelect(feed.feed)}
                icon={<Icon.Activity size="24" />}
              />
              <div
                onClick={() => handleDeleteFeed(feed.feed)}
                className="cursor-pointer opacity-50 hover:opacity-80 mt-2"
              >
                <Icon.X size="16" />
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
