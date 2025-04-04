'use client';

import { useFilterContext, useModal, usePubkyClientContext } from '@/contexts';
import { ICustomFeed } from '@/types';
import { Icon, Typography } from '@social/ui-shared';
import { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { Utils } from '@social/utils-shared';

interface CustomFeedsProps extends React.HTMLAttributes<HTMLDivElement> {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CustomFeeds({ loading, setLoading, ...rest }: CustomFeedsProps) {
  const baseCSS =
    'cursor-pointer hover:bg-opacity-10 py-3 px-5 justify-center items-center gap-2 hidden lg:inline-flex bg-white bg-opacity-5 rounded-tl-lg rounded-tr-lg';
  const activeCSS = 'bg-white bg-opacity-10 rounded-tr-lg';

  const { loadFeeds, deleteFeed } = usePubkyClientContext();
  const { layout, selectedFeed, setSelectedFeed, setReach, setSort, setContent, setLayout } = useFilterContext();
  const { openModal } = useModal();
  const [feeds, setFeeds] = useState<{ feed: ICustomFeed; name: string }[]>();
  const maxWidth = layout === 'wide' ? 'max-w-full' : 'max-w-[520px] xl:max-w-[785px]';

  const handleLoadFeeds = async () => {
    setLoading(true);
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
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedSelect = (feed: ICustomFeed) => {
    setSelectedFeed(feed);
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

  const handleAddFeed = async (feedToAdd: ICustomFeed, name: string) => {
    try {
      setFeeds((prevFeeds) => [...(prevFeeds || []), { feed: feedToAdd, name }]);
    } catch (error) {
      console.error('Error adding feed:', error);
    }
  };

  useEffect(() => {
    handleLoadFeeds();
  }, []);

  useEffect(() => {
    if (selectedFeed) {
      Utils.storage.set('feed', selectedFeed);
    }
  }, [selectedFeed]);

  return (
    <>
      {!loading && (
        <div id="custom-feeds-tabs" className={`${maxWidth} flex gap-1 overflow-x-auto no-scrollbar`}>
          <div className={twMerge(baseCSS, !selectedFeed ? activeCSS : '', rest.className)} onClick={handleForYouClick}>
            <Typography.Body className="text-[13px] leading-[13px]" variant="small-bold">
              All
            </Typography.Body>
          </div>
          {feeds?.map((feed, index) => {
            return (
              <div
                key={index}
                className={twMerge(baseCSS, selectedFeed === feed.feed ? activeCSS : '', rest.className)}
                onClick={() => handleFeedSelect(feed.feed)}
              >
                <Typography.Body className="whitespace-nowrap text-[13px] leading-[13px]" variant="small-bold">
                  {Utils.minifyText(feed.name, 11)}
                </Typography.Body>
                <div
                  id="delete-custom-feed"
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
          {feeds && (
            <div
              id="add-custom-feed"
              onClick={() => (loading ? undefined : openModal('createFeed', { handleLoadFeeds: handleAddFeed }))}
              className={twMerge(
                baseCSS,
                'bg-transparent border border-white border-opacity-30 hover:bg-white/10 border-dashed',
                rest.className
              )}
            >
              {loading ? <Icon.LoadingSpin size="24" /> : <Icon.Plus size="24" />}
            </div>
          )}
        </div>
      )}
    </>
  );
}
