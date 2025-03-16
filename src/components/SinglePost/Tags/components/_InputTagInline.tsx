'use client';

import { useEffect } from 'react';
import { Input, Typography } from '@social/ui-shared';
import EmojiPicker from '@/components/EmojiPicker';
import { Utils as TagsUtils } from '../utils';

interface InlineTagInputProps {
  arrayTags: string[];
  setArrayTags: React.Dispatch<React.SetStateAction<string[]>>;
  onClose?: () => void;
  className?: string;
}

export function InlineTagInput({ arrayTags, setArrayTags, onClose, className }: InlineTagInputProps) {
  const { tags, setTags, tag, setTag, tagsError, showEmojis, setShowEmojis, wrapperRefEmojis, addTag } =
    TagsUtils.TagsCommonFunctions.useSimpleTags(arrayTags);

  useEffect(() => {
    setTags(arrayTags);
  }, [arrayTags, setTags]);

  useEffect(() => {
    setArrayTags(tags);
  }, [tags, setArrayTags]);

  return (
    <div className={className}>
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
        onChange={setTag}
        onAddTag={addTag}
        onEmojiPickerClick={() => setShowEmojis(true)}
        showCloseButton={!!onClose}
        onClose={onClose}
        variant="small"
        autoFocus
      />

      {tagsError && (
        <Typography.Body className="whitespace-nowrap text-[#e95164]" variant="small">
          Max 4 tags
        </Typography.Body>
      )}
    </div>
  );
}

export default InlineTagInput;
