'use client';

import { useEffect, useRef, useState } from 'react';
import { Icon, Button, PostUtil, Input, Typography } from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import EmojiPicker from '@/components/EmojiPicker';
import { useDrawerClickOutside } from '@/hooks/useDrawerClickOutside';

interface TagProps extends React.HTMLAttributes<HTMLDivElement> {
  arrayTags: string[];
  setArrayTags: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function ContentTagCreatePost({
  arrayTags,
  setArrayTags,
}: TagProps) {
  const [tag, setTag] = useState('');
  const [tagsError, setTagsError] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [localTags, setLocalTags] = useState<string[]>(arrayTags); // Stato locale dei tag
  const wrapperRefEmojis = useRef<HTMLDivElement>(null);
  useDrawerClickOutside(wrapperRefEmojis, () => setShowEmojis(false));

  useEffect(() => {
    setLocalTags(arrayTags);
  }, [arrayTags]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valueWithoutSpaces = e.target.value
      .toLowerCase()
      .replace(/\s/g, '')
      .replace(/!/g, '');
    setTag(valueWithoutSpaces);
  };

  const handleAddTag = () => {
    const trimmedTag = tag.trim();
    if (!trimmedTag || localTags.includes(trimmedTag)) return;

    if (localTags.length >= 4) {
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
    if (updatedTags.length <= 4) setTagsError(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddTag();
    }
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
                    <div
                      className="flex items-center"
                      onClick={() => handleRemoveTag(index)}
                    >
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
            <div
              className="fixed inset-0 bg-black bg-opacity-30 z-[9998]"
              onClick={() => setShowEmojis(false)}
            />
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
        <Input.Text
          placeholder="tag"
          value={tag}
          maxLength={20}
          onChange={handleChange}
          autoFocus
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
                icon={<Icon.Smiley size="32" />}
                className="hidden ml-2 lg:flex"
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
      {tagsError && (
        <Typography.Body variant="small" className="text-[#e95164]">
          Max 4 tags
        </Typography.Body>
      )}
    </div>
  );
}
