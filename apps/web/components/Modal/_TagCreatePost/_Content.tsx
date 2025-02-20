'use client';

import { useEffect, useRef, useState } from 'react';
import { Icon, Button, PostUtil, Input, Typography } from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import EmojiPicker from '@/components/EmojiPicker';

interface TagProps extends React.HTMLAttributes<HTMLDivElement> {
  arrayTags: string[];
  setArrayTags: React.Dispatch<React.SetStateAction<string[]>>;
  tagsError: boolean;
  setTagsError: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ContentTagCreatePost({
  arrayTags,
  setArrayTags,
  tagsError,
  setTagsError,
}: TagProps) {
  const [tag, setTag] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const wrapperRefEmojis = useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valueWithoutSpaces = e.target.value
      .toLowerCase()
      .replace(/\s/g, '')
      .replace(/!/g, '');
    setTag(valueWithoutSpaces);
  };

  const handleAddTag = () => {
    // check if the tag is already in the array
    if (arrayTags.includes(tag.trim())) {
      return;
    }

    if (arrayTags.length >= 4) {
      setTagsError(true);
    } else {
      const trimmedTag = tag.trim();
      if (trimmedTag !== '') {
        if (!arrayTags.includes(trimmedTag)) {
          setTag('');
          setArrayTags([...arrayTags, trimmedTag]);
        } else {
          setTag('');
        }
      }
    }
  };

  const handleRemoveTag = (indexToRemove: number) => {
    setArrayTags(arrayTags.filter((_, index) => index !== indexToRemove));
    if (arrayTags.length <= 4) {
      setTagsError(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddTag();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRefEmojis.current &&
        !wrapperRefEmojis.current.contains(event.target as Node)
      ) {
        setShowEmojis(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRefEmojis]);

  return (
    <div className="w-full flex-col inline-flex">
      <div>
        <div className="mt-2 justify-start items-start">
          {arrayTags.length > 0 ? (
            <div className="justify-start items-start">
              {arrayTags.map((tag, index) => (
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
                  const emojiLength = new Blob([emojiObject.native]).size / 2;
                  if (tag.length + emojiLength <= 20) {
                    setTag(tag + emojiObject.native);
                  }
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
