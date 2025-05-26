import { BottomSheet } from '@/components/BottomSheet';
import DropDown from '@/components/DropDown';
import { useFilterContext, usePubkyClientContext } from '@/contexts';
import { useIsMobile } from '@/hooks/useIsMobile';
import { ICustomFeed, TReach } from '@/types';
import { Button, Icon, Input, PostUtil, Typography } from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import { useEffect, useRef, useState } from 'react';
import EmojiPicker from '@/components/EmojiPicker';
import { useDrawerClickOutside } from '@/hooks/useDrawerClickOutside';
import { checkDuplicateName, checkDuplicateContent, handleAddTag, handleRemoveTag } from './_UtilsFeed';

interface CreateFeedProps {
  setShowModalCreateFeed: React.Dispatch<React.SetStateAction<boolean>>;
  handleLoadFeeds: any;
}

export default function ContentCreateFeed({ setShowModalCreateFeed, handleLoadFeeds }: CreateFeedProps) {
  const { saveFeed, searchTags, loadFeeds } = usePubkyClientContext();
  const { reach, layout, sort, content } = useFilterContext();
  const [localReach, setLocalReach] = useState<TReach>(reach as TReach);
  const [localLayout, setLocalLayout] = useState(layout);
  const [localSort, setLocalSort] = useState(sort);
  const [localContent, setLocalContent] = useState(content);
  const isMobile = useIsMobile();
  const [tag, setTag] = useState('');
  const [tagsFeed, setTagsFeed] = useState<string[]>([]);
  const [nameFeed, setNameFeed] = useState<string>('');
  const [tagsError, setTagsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [duplicateError, setDuplicateError] = useState<string | null>(null);
  const wrapperRefEmojis = useRef<HTMLDivElement>(null);
  useDrawerClickOutside(wrapperRefEmojis, () => setShowEmojis(false));

  useEffect(() => {
    setTagsFeed(searchTags);
  }, [searchTags]);

  const handleAddFeed = async (feedToAdd: ICustomFeed, name: string) => {
    await saveFeed(feedToAdd, name);
    handleLoadFeeds(feedToAdd, name);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setDuplicateError(null);

    const feed: ICustomFeed = {
      tags: tagsFeed,
      reach: localReach,
      layout: localLayout,
      sort: localSort,
      content: localContent
    };

    // Check for duplicate feeds
    const existingFeeds = await loadFeeds();

    // First check for duplicate name
    if (checkDuplicateName(existingFeeds, nameFeed)) {
      setDuplicateError(`There is already a feed with the name: "${nameFeed}"`);
      setLoading(false);
      return;
    }

    // Then check for duplicate content
    const duplicateFeed = checkDuplicateContent(existingFeeds, feed);
    if (duplicateFeed) {
      setDuplicateError(`This feed already exists with the name: "${duplicateFeed.name}"`);
      setLoading(false);
      return;
    }

    await handleAddFeed(feed, nameFeed);

    setNameFeed('');
    setTagsFeed([]);
    setLoading(false);
    setShowModalCreateFeed(false);
  };

  const onAddTag = () => handleAddTag(tag, tagsFeed, setTagsFeed, setTag, setTagsError);
  const onRemoveTag = (indexToRemove: number) => handleRemoveTag(indexToRemove, tagsFeed, setTagsFeed, setTagsError);

  return (
    <>
      <div className="my-4 flex flex-col sm:flex-row gap-8">
        <div className="w-full order-2 sm:order-1">
          <div>
            <Input.Label className="text-uppercase text-white/30" value="Feed Name" />
            <Input.Text
              id="create-feed-name-input"
              value={nameFeed}
              maxLength={20}
              autoFocus
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNameFeed(e.target.value)}
              placeholder="name"
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
            <div className="w-full">
              <Input.Label className="text-uppercase text-white/30" value="Filter on content tags" />
              <Input.Tag
                idPrefix="create-feed"
                value={tag}
                onChange={(value) => setTag(value)}
                onAddTag={onAddTag}
                onEmojiPickerClick={() => setShowEmojis(true)}
                variant="default"
                className="w-full"
              />
            </div>
          </div>
          <div className="mt-2 justify-start items-start">
            {tagsFeed && tagsFeed.length > 0 ? (
              <div id="create-feed-tags-container" className="justify-start items-start">
                {tagsFeed.map((tag, index) => (
                  <PostUtil.Tag
                    key={index}
                    action={
                      <div className="flex items-center" onClick={() => onRemoveTag(index)}>
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
              Max 6 tags
            </Typography.Body>
          )}
        </div>
        <div className="flex gap-4 sm:gap-2 order-1 sm:order-2 sm:flex-col w-[180px]">
          <div>
            <Typography.Label className="text-opacity-30">Reach</Typography.Label>
            {isMobile ? (
              <BottomSheet.Reach reach={localReach} setReach={setLocalReach} />
            ) : (
              <DropDown.Reach reach={localReach} setReach={setLocalReach} />
            )}
          </div>
          <div>
            <Typography.Label className="text-opacity-30">Sort</Typography.Label>
            {isMobile ? (
              <BottomSheet.SortPosts sort={localSort} setSort={setLocalSort} />
            ) : (
              <DropDown.SortPosts sort={localSort} setSort={setLocalSort} />
            )}{' '}
          </div>
          <div>
            <Typography.Label className="text-opacity-30">Content</Typography.Label>
            {isMobile ? (
              <BottomSheet.Content content={localContent} setContent={setLocalContent} />
            ) : (
              <DropDown.Content content={localContent} setContent={setLocalContent} />
            )}
          </div>
          {!isMobile && (
            <div>
              <Typography.Label className="text-opacity-30">Layout</Typography.Label>
              <DropDown.Layout layout={localLayout} setLayout={setLocalLayout} />
            </div>
          )}
        </div>
      </div>
      {duplicateError && (
        <Typography.Body variant="small" className="text-[#e95164] mt-2">
          {duplicateError}
        </Typography.Body>
      )}
      <Button.Medium
        id="create-feed-save-btn"
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
