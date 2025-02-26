import { BottomSheet } from '@/components/BottomSheet';
import DropDown from '@/components/DropDown';
import { useFilterContext, usePubkyClientContext } from '@/contexts';
import { useIsMobile } from '@/hooks/useIsMobile';
import { ICustomFeed } from '@/types';
import { Button, Icon, Input, PostUtil, Typography } from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import { useEffect, useRef, useState } from 'react';
import EmojiPicker from '@/components/EmojiPicker';
import { useDrawerClickOutside } from '@/hooks/useDrawerClickOutside';

interface CreateFeedProps {
  setShowModalCreateFeed: React.Dispatch<React.SetStateAction<boolean>>;
  handleLoadFeeds: any;
}

export default function ContentCreateFeed({ setShowModalCreateFeed, handleLoadFeeds }: CreateFeedProps) {
  const { saveFeed, searchTags } = usePubkyClientContext();
  const { reach, layout, sort } = useFilterContext();
  const isMobile = useIsMobile();
  const [tag, setTag] = useState('');
  const [tagsFeed, setTagsFeed] = useState<string[]>([]);
  const [nameFeed, setNameFeed] = useState<string>('');
  const [tagsError, setTagsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const wrapperRefEmojis = useRef<HTMLDivElement>(null);
  useDrawerClickOutside(wrapperRefEmojis, () => setShowEmojis(false));

  useEffect(() => {
    setTagsFeed(searchTags);
  }, [searchTags]);

  const handleAddFeed = async (feedToAdd: ICustomFeed, name: string) => {
    await saveFeed(feedToAdd, name);
    handleLoadFeeds();
  };

  const handleSubmit = async () => {
    setLoading(true);
    const feed: ICustomFeed = {
      tags: tagsFeed,
      reach: reach,
      layout: layout,
      sort: sort,
      content: 'all'
    };

    await handleAddFeed(feed, nameFeed);

    setNameFeed('');
    setTagsFeed([]);
    setLoading(false);
    setShowModalCreateFeed(false);
  };

  const handleAddTag = () => {
    // check if the tag is already in the array
    if (tagsFeed?.includes(tag.trim())) {
      return;
    }

    if (tagsFeed.length >= 4) {
      setTagsError(true);
    } else {
      const trimmedTag = tag.trim();
      if (trimmedTag !== '' && !tagsFeed.includes(trimmedTag)) {
        setTagsFeed([...tagsFeed, trimmedTag]);
        setTag('');
      }
    }
  };

  const handleRemoveTag = (indexToRemove: number) => {
    tagsFeed && setTagsFeed(tagsFeed.filter((_, index) => index !== indexToRemove));
    if (tagsFeed && tagsFeed.length <= 4) {
      setTagsError(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddTag();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valueWithoutSpaces = e.target.value.toLowerCase().replace(/\s/g, '').replace(/!/g, '');
    setTag(valueWithoutSpaces);
  };

  return (
    <>
      <div className="my-4 flex flex-col sm:flex-row gap-8">
        <div className="w-full order-2 sm:order-1">
          <div>
            <Input.Text
              value={nameFeed}
              maxLength={20}
              autoFocus
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNameFeed(e.target.value)}
              placeholder="Add Feed name"
            />
          </div>
          <div className="flex flex-row w-full mt-4">
            {showEmojis && (
              <>
                <div className="fixed inset-0 bg-black bg-opacity-30 z-[9998]" onClick={() => setShowEmojis(false)} />
                <div
                  id="emoji-picker"
                  className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[9999] max-h-[90vh] max-w-[90vw] overflow-auto rounded-lg bg-white shadow-lg"
                  ref={wrapperRefEmojis}
                >
                  <EmojiPicker
                    onEmojiSelect={(emojiObject) => {
                      setTag(tag + emojiObject.native);
                      setShowEmojis(false);
                    }}
                    maxLength={20}
                    currentInput={tag}
                  />
                </div>
              </>
            )}
            {/* <Input.Label value="Add tag" /> */}
            <Input.Text
              placeholder="tag"
              value={tag}
              maxLength={20}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              action={
                <div className="flex">
                  <Button.Action
                    id="add-btn"
                    icon={<Icon.Plus size="18" />}
                    variant="custom"
                    size="medium"
                    className={tag ? 'flex' : 'hidden'}
                    onClick={handleAddTag}
                  />
                  <Button.Action
                    id="emoji-btn"
                    variant="custom"
                    className="hidden ml-2 lg:flex"
                    icon={<Icon.Smiley size="32" />}
                    size="medium"
                    onClick={(event) => {
                      event.stopPropagation();
                      setShowEmojis(true);
                    }}
                  />
                </div>
              }
            />
          </div>
          <div className="mt-2 justify-start items-start">
            {tagsFeed && tagsFeed.length > 0 ? (
              <div className="justify-start items-start">
                {tagsFeed.map((tag, index) => (
                  <PostUtil.Tag
                    key={index}
                    action={
                      <div className="flex items-center" onClick={() => handleRemoveTag(index)}>
                        <Icon.X size="16" />
                      </div>
                    }
                    clicked
                    color={tag && Utils.generateRandomColor(tag)}
                    className="mr-2 my-1"
                  >
                    {tag}
                  </PostUtil.Tag>
                ))}
              </div>
            ) : (
              <Typography.Body variant="small" className="text-opacity-30">
                No tags yet.
              </Typography.Body>
            )}
          </div>
          {tagsError && (
            <Typography.Body variant="small" className="text-[#e95164]">
              Max 4 tags
            </Typography.Body>
          )}
        </div>
        <div className="flex gap-4 sm:gap-2 order-1 sm:order-2 sm:flex-col w-[180px]">
          <div>
            <Typography.Label className="text-opacity-30">Reach</Typography.Label>
            {isMobile ? <BottomSheet.Reach /> : <DropDown.Reach />}
          </div>
          <div>
            <Typography.Label className="text-opacity-30">Sort</Typography.Label>
            {isMobile ? <BottomSheet.SortPosts /> : <DropDown.SortPosts />}{' '}
          </div>
          <div>
            <Typography.Label className="text-opacity-30">Content</Typography.Label>
            {isMobile ? <BottomSheet.Content /> : <DropDown.Content />}
          </div>
          {!isMobile && (
            <div>
              <Typography.Label className="text-opacity-30">Layout</Typography.Label>
              <DropDown.Layout />
            </div>
          )}
        </div>
      </div>
      <Button.Medium
        loading={loading}
        disabled={!nameFeed || tagsFeed?.length === 0}
        icon={<Icon.Activity size="16" color={!nameFeed || tagsFeed?.length === 0 ? 'grey' : 'white'} />}
        onClick={() => (loading || !nameFeed || tagsFeed?.length === 0 ? undefined : handleSubmit())}
        className="mt-4"
      >
        Save Feed
      </Button.Medium>
    </>
  );
}
