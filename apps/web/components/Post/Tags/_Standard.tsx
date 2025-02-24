import {
  Icon,
  Input,
  Post as PostUI,
  PostUtil,
  Tooltip as TooltipUI,
  Typography,
} from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import Tooltip from '@/components/Tooltip';
import { PostView } from '@/types/Post';
import EmojiPicker from '@/components/EmojiPicker';
import { useTagsLogic } from './components/TagsUtils';
import { useState } from 'react';
import { usePubkyClientContext } from '@/contexts';

interface PostProps extends React.HTMLAttributes<HTMLDivElement> {
  post: PostView;
  largeView?: boolean;
}

export default function Standard({ post, largeView = false }: PostProps) {
  const {
    tags,
    tagInput,
    setTagInput,
    showEmojis,
    setShowEmojis,
    loadingTags,
    handleAddTag,
    handleDeleteTag,
    handleInputChange,
    handleKeyDown,
    wrapperRefEmojis,
    openModal,
    isMobile,
    addTagInput,
    setAddTagInput,
  } = useTagsLogic(post);

  const { pubky } = usePubkyClientContext();
  const [showTooltipTag, setShowTooltipTag] = useState<string | null>(null);

  return (
    <div
      className="lg:mt-3 cursor-default"
      onClick={(event) => event.stopPropagation()}
    >
      {!(isMobile && tags.length === 0) && (
        <div
          id="tags"
          className="gap-2 flex-row inline-flex items-center flex-wrap mt-2 lg:mt-0"
        >
          {!largeView &&
            tags.slice(0, 3).map((tagObj, index) => {
              const isTagFound = tagObj?.relationship || false;

              return (
                <PostUI.Footer key={index}>
                  <TooltipUI.Root
                    delay={0}
                    setShowTooltip={setShowTooltipTag}
                    tagId={tagObj?.label}
                  >
                    {showTooltipTag === tagObj?.label && (
                      <Tooltip.Tag2 tags={tagObj} />
                    )}
                    {tagObj && (
                      <PostUtil.Tag
                        id={`tag-${index}`}
                        clicked={isTagFound}
                        color={
                          tagObj?.label &&
                          Utils.generateRandomColor(tagObj?.label)
                        }
                        onClick={() =>
                          pubky
                            ? isTagFound
                              ? handleDeleteTag(tagObj?.label)
                              : handleAddTag(tagObj?.label)
                            : openModal('join')
                        }
                      >
                        <div
                          id={`tag-${index}-count`}
                          className="flex gap-2 items-center"
                        >
                          {Utils.minifyText(tagObj?.label, 20)}
                          {loadingTags === tagObj?.label ? (
                            <Icon.LoadingSpin size="12" />
                          ) : (
                            <Typography.Caption
                              variant="bold"
                              className="text-opacity-60"
                            >
                              {tagObj?.taggers_count}
                            </Typography.Caption>
                          )}
                        </div>
                      </PostUtil.Tag>
                    )}
                  </TooltipUI.Root>
                </PostUI.Footer>
              );
            })}

          {!largeView && (
            <div className="hidden md:flex">
              {addTagInput ? (
                <>
                  {showEmojis && (
                    <div
                      className="absolute translate-y-[10%] translate-x-[30%] z-10"
                      ref={wrapperRefEmojis}
                    >
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
                          onClick={
                            !loadingTags
                              ? () => handleAddTag(tagInput)
                              : undefined
                          }
                          className={`${tagInput ? 'flex' : 'hidden'} cursor-pointer p-1 rounded-full bg-white bg-opacity-10 ${loadingTags ? 'opacity-50' : 'opacity-80 hover:opacity-100'}`}
                        >
                          {loadingTags ? (
                            <Icon.LoadingSpin size="12" />
                          ) : (
                            <Icon.Plus size="12" />
                          )}
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
                </>
              ) : (
                <div
                  id="show-add-tag-input-btn"
                  onClick={() =>
                    pubky ? setAddTagInput(true) : openModal('join')
                  }
                  className="cursor-pointer relative w-8 h-8 rounded-lg border border-white opacity-30 hover:opacity-50 border-dashed justify-center items-center gap-1 inline-flex"
                >
                  <Icon.Plus size="16" />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
