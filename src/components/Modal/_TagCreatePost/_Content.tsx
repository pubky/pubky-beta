'use client';

import { useEffect, useRef, useState } from 'react';
import { Icon, PostUtil, Input, Typography } from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import EmojiPicker from '@/components/EmojiPicker';
import { useDrawerClickOutside } from '@/hooks/useDrawerClickOutside';
import { useSuggestedTags } from '@/hooks/useSuggestedTags';

interface TagProps extends React.HTMLAttributes<HTMLDivElement> {
  arrayTags: string[];
  setArrayTags: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function ContentTagCreatePost({ arrayTags, setArrayTags }: TagProps) {
  const [tag, setTag] = useState('');
  const [tagsError, setTagsError] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [localTags, setLocalTags] = useState<string[]>(arrayTags);
  const wrapperRefEmojis = useRef<HTMLDivElement>(null);
  useDrawerClickOutside(wrapperRefEmojis, () => setShowEmojis(false));

  const { suggestedTags, selectedTagIndex, handleKeyDown, handleTagClick } = useSuggestedTags({
    tagInput: tag,
    onTagSelect: (tag) => setTag(tag)
  });

  const handleAddTagWithCheck = (tagValue: string) => {
    if (selectedTagIndex > -1) {
      const selectedTag = suggestedTags[selectedTagIndex];
      setTag(selectedTag);
    } else {
      handleAddTag();
    }
  };

  useEffect(() => {
    setLocalTags(arrayTags);
  }, [arrayTags]);

  const handleAddTag = () => {
    const trimmedTag = tag.trim();
    if (!trimmedTag || localTags.includes(trimmedTag)) return;

    if (localTags.length > 5) {
      setTagsError(true);
      return;
    }

    const updatedTags = [...localTags, trimmedTag];
    setLocalTags(updatedTags);
    setArrayTags(updatedTags);
    setTag('');
  };

  const handleRemoveTag = (indexToRemove: number) => {
    const updatedTags = localTags.filter((_, index) => index !== indexToRemove);
    setLocalTags(updatedTags);
    setArrayTags(updatedTags);
    if (updatedTags.length < 5) setTagsError(false);
  };

  return (
    <div className="w-full flex-col inline-flex">
      <div>
        <div className="mt-2 justify-start items-start">
          {localTags.length > 0 ? (
            <div className="justify-start items-start">
              {localTags.map((tag, index) => (
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
        <div className="relative w-full" onKeyDown={handleKeyDown} tabIndex={0}>
          <Input.Tag
            value={tag}
            onChange={(value) => setTag(value)}
            onAddTag={handleAddTagWithCheck}
            onEmojiPickerClick={() => setShowEmojis(true)}
            variant="default"
            className="w-full"
            autoFocus
          />
          {suggestedTags.length > 0 && (
            <div className="mt-1 bg-[#05050A] border border-white border-opacity-20 rounded-lg z-20 w-full max-h-[150px] overflow-y-auto scrollbar-thin scrollbar-webkit">
              {suggestedTags.map((tag, index) => (
                <div
                  key={index}
                  onClick={() => handleTagClick(tag)}
                  className={`cursor-pointer hover:bg-white hover:bg-opacity-10 rounded px-4 py-2 ${
                    index === selectedTagIndex ? 'bg-white bg-opacity-10' : ''
                  }`}
                >
                  <Typography.Body variant="small" className="text-opacity-80 hover:text-opacity-100">
                    {tag}
                  </Typography.Body>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {tagsError && (
        <Typography.Body variant="small" className="text-[#e95164]">
          Max 6 tags
        </Typography.Body>
      )}
    </div>
  );
}
