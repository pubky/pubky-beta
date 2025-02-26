import { PostView } from '@/types/Post';
import { useTagsLogic } from './TagsUtils';
import { usePubkyClientContext } from '@/contexts';
import EmojiPicker from '@/components/EmojiPicker';
import { Icon, Input } from '@social/ui-shared';

interface InputTagProps {
  post: PostView;
}

export default function InputTag({ post }: InputTagProps) {
  const {
    tagInput,
    setTagInput,
    showEmojis,
    setShowEmojis,
    loadingTags,
    handleAddTag,
    handleInputChange,
    handleKeyDown,
    wrapperRefEmojis,
    openModal,
    addTagInput,
    setAddTagInput
  } = useTagsLogic(post);
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
          <div className="w-fit">
            <Input.Text
              placeholder="tag"
              className="h-[32px] p-3 text-[14px] rounded-lg"
              value={tagInput}
              maxLength={20}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              autoFocus
              disabled={loadingTags !== ''}
              action={
                <div className="flex gap-1 -mr-2">
                  <div
                    id="add-tag-btn"
                    onClick={!loadingTags ? () => handleAddTag(tagInput) : undefined}
                    className={`${tagInput ? 'flex' : 'hidden'} cursor-pointer p-1 rounded-full bg-white bg-opacity-10 ${loadingTags ? 'opacity-50' : 'opacity-80 hover:opacity-100'}`}
                  >
                    {loadingTags ? <Icon.LoadingSpin size="12" /> : <Icon.Plus size="12" />}
                  </div>
                  <div className="flex">
                    <div
                      onClick={() => setShowEmojis(true)}
                      className="hidden mr-1 lg:flex cursor-pointer p-1 rounded-full bg-white bg-opacity-10 opacity-80 hover:opacity-100"
                    >
                      <Icon.Smiley size="12" />
                    </div>
                    <div
                      id="close-add-tag-input-btn"
                      onClick={() => setAddTagInput(false)}
                      className="cursor-pointer p-1 rounded-full bg-white bg-opacity-10 opacity-80 hover:opacity-100"
                    >
                      <Icon.X size="12" />
                    </div>
                  </div>
                </div>
              }
            />
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
