'use client';

import { usePubkyClientContext } from '@/contexts';
import { ICustomFeed } from '@/types';
import { Icon, Typography } from '@social/ui-shared';
import { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import Modal from '../Modal';
import { Utils } from '@social/utils-shared';

interface CustomFeedsProps extends React.HTMLAttributes<HTMLDivElement> {
  selectedFeed: ICustomFeed | undefined;
  setSelectedFeed: React.Dispatch<
    React.SetStateAction<ICustomFeed | undefined>
  >;
}

export default function CustomFeeds({
  selectedFeed,
  setSelectedFeed,
  ...rest
}: CustomFeedsProps) {
  const baseCSS =
    'cursor-pointer hover:bg-opacity-20 py-3 px-5 justify-center items-center gap-2 inline-flex bg-white bg-opacity-10 rounded-tl-lg rounded-tr-lg';
  const activeCSS =
    'bg-white bg-opacity-20 rounded-tr-lg border-t border-white';
  const [showModalCreateFeed, setShowModalCreateFeed] = useState(false);
  const [tagsFeed, setTagsFeed] = useState<string[]>([]);
  const [nameFeed, setNameFeed] = useState<string>('');
  const [feeds, setFeeds] = useState<{ feed: ICustomFeed; name: string }[]>();
  const { saveFeed, loadFeeds, deleteFeed } = usePubkyClientContext();

  useEffect(() => {
    handleLoadFeeds();
  }, []);

  const handleLoadFeeds = async () => {
    const result = await loadFeeds();
    setFeeds(result);

    const storedFeed = Utils.storage.get('feed');
    if (storedFeed) {
      const matchingFeed = result.find(
        (feed) => JSON.stringify(feed.feed) === JSON.stringify(storedFeed)
      );
      if (matchingFeed) {
        setSelectedFeed(matchingFeed.feed);
      } else {
        setSelectedFeed(undefined);
        Utils.storage.remove('feed');
      }
    }
  };

  useEffect(() => {
    if (selectedFeed) {
      Utils.storage.set('feed', selectedFeed);
    }
  }, [selectedFeed]);

  const handleAddFeed = async (feedToAdd: ICustomFeed, name: string) => {
    await saveFeed(feedToAdd, name);
    handleLoadFeeds();
  };

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
    <div className="flex gap-1 flex-wrap">
      <div
        className={twMerge(
          baseCSS,
          !selectedFeed ? activeCSS : '',
          rest.className
        )}
        onClick={handleForYouClick}
      >
        <Typography.Body variant="small-bold">For You</Typography.Body>
      </div>
      {feeds?.map((feed, index) => {
        return (
          <div
            key={index}
            className={twMerge(
              baseCSS,
              selectedFeed === feed.feed ? activeCSS : '',
              rest.className
            )}
            onClick={() => handleFeedSelect(feed.feed)}
          >
            <Typography.Body variant="small-bold">
              {Utils.minifyText(feed.name, 11)}
            </Typography.Body>
            <div
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteFeed(feed.feed);
              }}
            >
              <Icon.X size="16" color="gray" />
            </div>
          </div>
        );
      })}
      {feeds && feeds?.length < 4 && (
        <div
          onClick={() => setShowModalCreateFeed(true)}
          className={twMerge(baseCSS, rest.className)}
        >
          <Icon.Plus size="24" />
        </div>
      )}
      <Modal.CreateFeed
        setNameFeed={setNameFeed}
        nameFeed={nameFeed}
        handleAddFeed={handleAddFeed}
        setShowModalCreateFeed={setShowModalCreateFeed}
        showModalCreateFeed={showModalCreateFeed}
        setTagsFeed={setTagsFeed}
        tagsFeed={tagsFeed}
      />
    </div>
  );
}
