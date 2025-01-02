'use client';

import { Icon, SideCard } from '@social/ui-shared';
import { useFilterContext, usePubkyClientContext } from '@/contexts';
import { ICustomFeed } from '@/types';
import { useEffect, useState } from 'react';
import { Utils } from '@social/utils-shared';

export default function Feeds() {
  const { selectedFeed, setSelectedFeed } = useFilterContext();
  const [feeds, setFeeds] = useState<{ feed: ICustomFeed; name: string }[]>();
  const { loadFeeds } = usePubkyClientContext();

  useEffect(() => {
    handleLoadFeeds();
  }, []);

  const handleLoadFeeds = async () => {
    try {
      const result = await loadFeeds();
      setFeeds(result);

      const storedFeed = Utils.storage.get('feed');
      if (storedFeed) {
        const matchingFeed = result.find(
          (feed) => JSON.stringify(feed.feed) === JSON.stringify(storedFeed),
        );
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

  const handleForYouClick = () => {
    setSelectedFeed(undefined);
    Utils.storage.remove('feed');
  };

  return (
    <div className="mb-8">
      <SideCard.Header title="Feeds" className="mb-2" />
      <div>
        <SideCard.Item
          label="For you"
          value="for you"
          selected={!selectedFeed}
          onClick={handleForYouClick}
          icon={<Icon.Activity size="24" />}
        />
        {feeds?.map((feed, index) => {
          return (
            <SideCard.Item
              key={`${index}/${feed.name}`}
              label={Utils.minifyContent(feed.name, 11)}
              value={feed.name}
              selected={
                JSON.stringify(selectedFeed) === JSON.stringify(feed.feed)
              }
              onClick={() => handleFeedSelect(feed.feed)}
              icon={<Icon.Activity size="24" />}
            />
          );
        })}
      </div>
    </div>
  );
}
