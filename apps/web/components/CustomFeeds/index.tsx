'use client';

import { useFilterContext, usePubkyClientContext } from '@/contexts';
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
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CustomFeeds({
  selectedFeed,
  setSelectedFeed,
  loading,
  setLoading,
  ...rest
}: CustomFeedsProps) {
  const baseCSS =
    'cursor-pointer hover:bg-opacity-20 py-3 px-5 justify-center items-center gap-2 hidden lg:inline-flex bg-white bg-opacity-10 rounded-tl-lg rounded-tr-lg';
  const activeCSS =
    'bg-white bg-opacity-20 rounded-tr-lg border-t border-white';
  const { reach } = useFilterContext();
  const [showModalCreateFeed, setShowModalCreateFeed] = useState(false);
  const [tagsFeed, setTagsFeed] = useState<string[]>([]);
  const [nameFeed, setNameFeed] = useState<string>('');
  const [feeds, setFeeds] = useState<{ feed: ICustomFeed; name: string }[]>();
  const { saveFeed, loadFeeds, deleteFeed } = usePubkyClientContext();

  useEffect(() => {
    handleLoadFeeds();
  }, []);

  const handleLoadFeeds = async () => {
    setLoading(true);
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
      setLoading(false);
    } finally {
      setLoading(false);
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
    <>
      {!loading && (
        <div className="flex gap-1 flex-wrap">
          <div
            className={twMerge(
              baseCSS,
              !selectedFeed ? activeCSS : '',
              rest.className,
            )}
            onClick={handleForYouClick}
          >
            <Typography.Body
              className="text-[13px] leading-[13px]"
              variant="small-bold"
            >
              {reach.charAt(0).toUpperCase() + reach.slice(1)}
            </Typography.Body>
          </div>
          {feeds?.map((feed, index) => {
            return (
              <div
                key={index}
                className={twMerge(
                  baseCSS,
                  selectedFeed === feed.feed ? activeCSS : '',
                  rest.className,
                )}
                onClick={() => handleFeedSelect(feed.feed)}
              >
                <Typography.Body
                  className="text-[13px] leading-[13px]"
                  variant="small-bold"
                >
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
              onClick={() =>
                loading ? undefined : setShowModalCreateFeed(true)
              }
              className={twMerge(
                baseCSS,
                'bg-transparent border border-white border-opacity-30 hover:border-opacity-50 border-dashed',
                rest.className,
              )}
            >
              {loading ? (
                <Icon.LoadingSpin size="24" />
              ) : (
                <Icon.Plus size="24" />
              )}
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
      )}
    </>
  );
}
