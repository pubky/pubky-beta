import { PostType, PostView } from '@/types/Post';
import { useTagsLogic } from './TagsUtils';
import { usePubkyClientContext } from '@/contexts';
import EmojiPicker from '@/components/EmojiPicker';
import { Icon, Input, Typography } from '@social/ui-shared';
import { useEffect, useState } from 'react';
import { searchTagsByPrefix } from '@/services/streamService';

interface InputTagProps {
  post: PostView;
  postType: PostType;
}

export default function InputTag({ post, postType }: InputTagProps) {
  const {
    tagInput,
    setTagInput,
    showEmojis,
    setShowEmojis,
    loadingTags,
    handleAddTag,
    wrapperRefEmojis,
    openModal,
    addTagInput,
    setAddTagInput
  } = useTagsLogic(post, postType);
  const { pubky } = usePubkyClientContext();
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);

  useEffect(() => {
    if (!tagInput.trim()) {
      setSuggestedTags([]);
      return;
    }

    let isActive = true;
    const timeoutId = setTimeout(async () => {
      try {
        const tags = await searchTagsByPrefix(tagInput.trim(), 0, 3);
        if (isActive) {
          setSuggestedTags(tags || []);
        }
      } catch (error) {
        if (isActive) {
          setSuggestedTags([]);
        }
      }
    }, 500);

    return () => {
      isActive = false;
      clearTimeout(timeoutId);
    };
  }, [tagInput]);

  return (
    <>
      {addTagInput ? (
        <>
          {showEmojis && (
            <div className="absolute translate-y-[10%] translate-x-[30%] z-10" ref={wrapperRefEmojis}>
              <EmojiPicker
                onEmojiSelect={(emojiObject) => {
                  setTagInput(tagInput + emojiObject.native);
                  setShowEmojis(false);
                }}
                maxLength={20}
                currentInput={tagInput}
              />
            </div>
          )}
          <div className="relative">
            <Input.Tag
              value={tagInput}
              onChange={setTagInput}
              onAddTag={handleAddTag}
              onEmojiPickerClick={() => setShowEmojis(true)}
              showCloseButton={true}
              onClose={() => setAddTagInput(false)}
              loading={loadingTags !== ''}
              variant="small"
              autoFocus
              className="w-max"
              autoComplete={false}
            />
            {suggestedTags.length > 0 && (
              <div className="absolute top-full left-0 mt-1 bg-[#05050A] border border-white border-opacity-20 rounded-lg z-20 w-[200px] max-h-[150px] overflow-y-auto scrollbar-thin scrollbar-webkit">
                {suggestedTags.map((tag, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setTagInput(tag);
                      setSuggestedTags([]);
                    }}
                    className="cursor-pointer hover:bg-white hover:bg-opacity-10 rounded px-4 py-2"
                  >
                    <Typography.Body variant="small" className="text-opacity-80 hover:text-opacity-100">
                      {tag}
                    </Typography.Body>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <div
          id="show-add-tag-input-btn"
          onClick={() => (pubky ? setAddTagInput(true) : openModal('join'))}
          className="cursor-pointer relative w-8 h-8 rounded-lg border border-white opacity-30 hover:opacity-50 border-dashed justify-center items-center gap-1 inline-flex"
        >
          <Icon.Plus size="16" />
        </div>
      )}
    </>
  );
}
