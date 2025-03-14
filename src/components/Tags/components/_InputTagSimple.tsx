'use client';
import { useEffect } from 'react';
import { Icon, PostUtil, Input, Typography } from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import EmojiPicker from '@/components/EmojiPicker';
import { Utils as TagsUtils } from '../utils';

interface SimpleTagInputProps {
  arrayTags: string[];
  setArrayTags: React.Dispatch<React.SetStateAction<string[]>>;
  className?: string;
}

export function InputTagSimple({ arrayTags, setArrayTags, className }: SimpleTagInputProps) {
  const {
    tags,
    setTags,
    tag,
    setTag,
    tagsError,
    setTagsError,
    showEmojis,
    setShowEmojis,
    wrapperRefEmojis,
    addTag,
    removeTag
  } = TagsUtils.TagsCommonFunctions.useSimpleTags(arrayTags);

  useEffect(() => {
    setTags(arrayTags);
  }, [arrayTags, setTags]);

  useEffect(() => {
    setArrayTags(tags);
  }, [tags, setArrayTags]);

  return (
    <div className={`w-full flex-col inline-flex ${className}`}>
      <div>
        <div className="mt-2 justify-start items-start">
          {tags.length > 0 ? (
            <div className="justify-start items-start">
              {tags.map((tagItem, index) => (
                <PostUtil.Tag
                  key={index}
                  action={
                    <div className="flex items-center" onClick={() => removeTag(index)}>
                      <Icon.X size="16" />
                    </div>
                  }
                  clicked
                  color={tagItem && Utils.generateRandomColor(tagItem)}
                  className="mr-2 my-1"
                >
                  {tagItem}
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
        <Input.Tag
          value={tag}
          onChange={(value) => setTag(value)}
          onAddTag={addTag}
          onEmojiPickerClick={() => setShowEmojis(true)}
          variant="default"
          className="w-full"
          autoFocus
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

export default InputTagSimple;
