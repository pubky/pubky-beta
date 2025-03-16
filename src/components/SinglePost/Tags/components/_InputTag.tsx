import { PostView } from '@/types/Post';
import { usePubkyClientContext } from '@/contexts';
import EmojiPicker from '@/components/EmojiPicker';
import { Icon, Input } from '@social/ui-shared';
import { TagsUtils } from '../utils/_TagsUtils';

interface InputTagProps {
  post: PostView;
}

export function InputTag({ post }: InputTagProps) {
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
  } = TagsUtils(post);
  const { pubky } = usePubkyClientContext();

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
          />
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

export default InputTag;
