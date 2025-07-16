import { BottomSheet } from '@/components/BottomSheet';
import DropDown from '@/components/DropDown';
import { useFilterContext, usePubkyClientContext } from '@/contexts';
import { useIsMobile } from '@/hooks/useIsMobile';
import { ICustomFeed, TReach } from '@/types';
import { Button, Icon, Input, PostUtil, Typography } from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import { useRef, useState } from 'react';
import EmojiPicker from '@/components/EmojiPicker';
import { useDrawerClickOutside } from '@/hooks/useDrawerClickOutside';
import { checkDuplicateName, checkDuplicateContent, handleAddTag, handleRemoveTag } from '../_CreateFeed/_UtilsFeed';

interface EditFeedProps {
  setShowModalEditFeed: React.Dispatch<React.SetStateAction<boolean>>;
  handleUpdateFeeds: (feed: ICustomFeed, name: string) => void;
  feedToEdit: ICustomFeed;
  feedName: string;
}

export default function ContentEditFeed({
  setShowModalEditFeed,
  handleUpdateFeeds,
  feedToEdit,
  feedName
}: EditFeedProps) {
  const { deleteFeed, updateFeed, loadFeeds } = usePubkyClientContext();
  const { layout, sort, content } = useFilterContext();
  const [localReach, setLocalReach] = useState<TReach>((feedToEdit?.reach as TReach) || 'all');
  const [localLayout, setLocalLayout] = useState(feedToEdit?.layout || layout);
  const [localSort, setLocalSort] = useState(feedToEdit?.sort || sort);
  const [localContent, setLocalContent] = useState(feedToEdit?.content || content);
  const isMobile = useIsMobile();
  const [tag, setTag] = useState('');
  const [tagsFeed, setTagsFeed] = useState<string[]>(feedToEdit?.tags || []);
  const [nameFeed, setNameFeed] = useState<string>(feedName || '');
  const [tagsError, setTagsError] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [duplicateError, setDuplicateError] = useState<string | null>(null);
  const wrapperRefEmojis = useRef<HTMLDivElement>(null);
  useDrawerClickOutside(wrapperRefEmojis, () => setShowEmojis(false));

  const handleUpdateFeed = async () => {
    setLoadingEdit(true);
    setDuplicateError(null);

    try {
      const updatedFeed: ICustomFeed = {
        ...feedToEdit,
        tags: tagsFeed,
        reach: localReach,
        layout: localLayout,
        sort: localSort,
        content: localContent
      };

      // Check for duplicate feeds, excluding the current feed being edited
      const existingFeeds = await loadFeeds();

      // First check for duplicate name (excluding current feed)
      if (checkDuplicateName(existingFeeds, nameFeed, feedName)) {
        setDuplicateError(`There is already a feed with the name: "${nameFeed}"`);
        setLoadingEdit(false);
        return;
      }

      // Then check for duplicate content
      const duplicateFeed = checkDuplicateContent(existingFeeds, updatedFeed, feedName);
      if (duplicateFeed) {
        setDuplicateError(`This feed already exists with the name: ${duplicateFeed.name}`);
        setLoadingEdit(false);
        return;
      }

      await updateFeed(feedToEdit, updatedFeed, nameFeed);
      handleUpdateFeeds(updatedFeed, nameFeed);
      setShowModalEditFeed(false);
    } catch (error) {
      console.error('Error updating feed:', error);
    } finally {
      setLoadingEdit(false);
    }
  };

  const handleDeleteFeed = async () => {
    if (feedToEdit) {
      setLoadingDelete(true);
      try {
        await deleteFeed(feedToEdit);
        handleUpdateFeeds(null, '');
        setShowModalEditFeed(false);
      } catch (error) {
        console.error('Error deleting feed:', error);
      } finally {
        setLoadingDelete(false);
      }
    }
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
      <div className="flex gap-4 mt-4">
        <Button.Medium
          id="delete-feed-btn"
          loading={loadingDelete}
          variant="default"
          className="bg-[#dc2626] border border-[#dc2626]"
          textCSS="text-[#dc2626]"
          icon={<Icon.Trash size="16" color="#dc2626" />}
          onClick={handleDeleteFeed}
        >
          Delete Feed
        </Button.Medium>
        <Button.Medium
          id="edit-feed-save-btn"
          loading={loadingEdit}
          disabled={!nameFeed || tagsFeed?.length === 0}
          icon={<Icon.Activity size="16" color={!nameFeed || tagsFeed?.length === 0 ? 'grey' : 'white'} />}
          onClick={() => (loadingEdit || !nameFeed || tagsFeed?.length === 0 ? undefined : handleUpdateFeed())}
        >
          Save Feed
        </Button.Medium>
      </div>
    </>
  );
}
