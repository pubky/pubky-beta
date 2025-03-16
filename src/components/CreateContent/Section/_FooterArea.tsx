'use client';

import { Button, Icon, Post, PostUtil } from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import { useAlertContext, useModal } from '@/contexts';
import { useRef, useState } from 'react';
import EmojiPicker from '@/components/EmojiPicker';
import { useDrawerClickOutside } from '@/hooks/useDrawerClickOutside';
import { Tags } from '@/components/Post/Tags';

interface FooterAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  visibleTextArea: boolean;
  textArea: boolean | undefined;
  content: string;
  setContent: (content: string) => void;
  cursorPosition: number;
  setCursorPosition: React.Dispatch<React.SetStateAction<number>>;
  setIsValidContent: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedFiles?: React.Dispatch<React.SetStateAction<File[]>>;
  selectedFiles?: File[];
  setArrayTags?: React.Dispatch<React.SetStateAction<string[]>>;
  arrayTags?: string[];
  filePreviews?: string[];
  setFilePreviews?: React.Dispatch<React.SetStateAction<string[]>>;
  showEmojis: boolean;
  setShowEmojis: React.Dispatch<React.SetStateAction<boolean>>;
  largeView: boolean;
  button: React.ReactNode;
  wrapperRefEmojis: React.RefObject<HTMLDivElement>;
  article?: boolean;
  markdown?: boolean;
  noFile?: boolean;
  maxLength?: number;
  setShowModalPost?: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  charCountArticle?: number;
}

export default function FooterArea({
  visibleTextArea,
  textArea,
  content,
  setContent,
  cursorPosition,
  setCursorPosition,
  setIsValidContent,
  setSelectedFiles,
  selectedFiles,
  setArrayTags,
  arrayTags,
  showEmojis,
  //largeView,
  filePreviews,
  setFilePreviews,
  setShowEmojis,
  wrapperRefEmojis,
  button,
  article,
  //markdown,
  noFile,
  maxLength = 1000,
  setShowModalPost,
  loading,
  charCountArticle
}: FooterAreaProps) {
  const { addAlert } = useAlertContext();
  const { openModal } = useModal();
  const [addTagInput, setAddTagInput] = useState<boolean>(false);
  const [tagInput, setTagInput] = useState('');
  const [errorTag, setErrorTag] = useState(false);
  const [showEmojisFastTag, setShowEmojisFastTag] = useState(false);
  const wrapperRefEmojisFastTag = useRef<HTMLDivElement>(null);
  useDrawerClickOutside(wrapperRefEmojisFastTag, () => setShowEmojisFastTag(false));

  const handleEmojiClick = (emoji: any) => {
    const textBeforeCursor = content.slice(0, cursorPosition);
    const textAfterCursor = content.slice(cursorPosition);
    const newText = textBeforeCursor + emoji.native + textAfterCursor;

    if (newText.length <= maxLength) {
      setContent(newText);
      setCursorPosition(cursorPosition + emoji.native.length);
      setIsValidContent(Utils.isValidContent(newText));
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    const maxSizeInMB = 20;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

    if (files) {
      const validFiles = Array.from(files).filter((file) => {
        const isImage = file.type.startsWith('image/');
        const isVideo = file.type.startsWith('video/');
        const isAudio = file.type.startsWith('audio/');
        const isValidType =
          (isImage && Utils.supportedImageTypes.includes(file.type)) ||
          (isVideo && Utils.supportedVideoTypes.includes(file.type)) ||
          (isAudio && Utils.supportedAudioTypes.includes(file.type)) ||
          file.type === 'application/pdf';

        if (!isValidType) {
          addAlert('File type not supported.', 'warning');
          return false;
        }

        if (file.size > maxSizeInBytes) {
          addAlert('The maximum allowed size is 20 MB', 'warning');
          return false;
        }
        return true;
      });

      if (selectedFiles && selectedFiles.length + validFiles.length > 4) {
        addAlert('Max 4 files only.', 'warning');
        return;
      }

      const newFiles = validFiles.slice(0, 4 - (selectedFiles?.length || 0));
      filePreviews.forEach((preview) => URL.revokeObjectURL(preview));

      setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles].slice(0, 4));
      setFilePreviews(newFiles.map((file) => URL.createObjectURL(file)));
    }
    event.target.value = '';
  };

  const handleAddTag = () => {
    if (!tagInput.trim() || !setArrayTags) return;

    // check if the tag is already in the array
    if (arrayTags?.includes(tagInput.trim())) {
      return;
    }

    setArrayTags((prevTags) => {
      if (prevTags.length >= 4) {
        setErrorTag(true);
        return prevTags;
      } else {
        setTagInput('');
        return [...prevTags, tagInput.trim()];
      }
    });
  };

  return (
    <>
      {(visibleTextArea || textArea || content || (arrayTags && arrayTags.length > 0)) && (
        <>
          {arrayTags && arrayTags.length > 0 && (
            <div id="tags" className="flex-wrap gap-2 flex items-center">
              {arrayTags.map((tag, index) => (
                <PostUtil.Tag
                  key={index}
                  clicked
                  color={tag && Utils.generateRandomColor(tag)}
                  action={
                    <div
                      className="flex items-center"
                      onClick={() => {
                        !loading && setArrayTags && setArrayTags((prev) => prev.filter((item) => item !== tag));
                        if (arrayTags.length <= 4) {
                          setErrorTag(false);
                        }
                      }}
                    >
                      <Icon.X size="16" />
                    </div>
                  }
                >
                  {Utils.minifyText(tag.replace(' ', ''), 20)}
                </PostUtil.Tag>
              ))}
            </div>
          )}
          <Post.Actions id="footer-actions" className="w-full flex-col sm:flex-row">
            {showEmojis && (
              <>
                <div className="fixed inset-0 bg-black bg-opacity-30 z-[9998]" onClick={() => setShowEmojis(false)} />
                <div
                  id="emoji-picker"
                  className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[9999] max-h-[90vh] max-w-[90vw] overflow-auto rounded-lg bg-white shadow-lg"
                  ref={wrapperRefEmojis}
                >
                  <EmojiPicker onEmojiSelect={handleEmojiClick} maxLength={maxLength} currentInput={content} />
                </div>
              </>
            )}
            <div id="add-tag-container" className="w-auto hidden lg:flex flex-col self-center">
              {addTagInput ? (
                <Tags.InlineTagInput
                  arrayTags={arrayTags || []}
                  setArrayTags={setArrayTags || (() => {})}
                  onClose={() => setAddTagInput(false)}
                />
              ) : (
                <div
                  id="show-add-tag-input-btn"
                  onClick={() => setAddTagInput(true)}
                  className={`cursor-pointer relative w-8 h-8 rounded-lg border border-white opacity-30 hover:opacity-50 border-dashed justify-center items-center gap-1 inline-flex`}
                >
                  <div>
                    <Icon.Plus size="16" />
                  </div>
                </div>
              )}
            </div>
            <div className="grow" />
            <div className="w-full justify-between sm:justify-end flex gap-2">
              <div id="content-length" className="text-opacity-30 text-white text-sm mt-4 mr-2">
                {noFile ? charCountArticle : content.length} / {maxLength}
              </div>
              <div className="flex gap-2">
                <Button.Action
                  id="tag-btn"
                  variant="custom"
                  className="flex lg:hidden"
                  icon={<Icon.Tag size="32" color={!arrayTags ? 'gray' : 'white'} />}
                  onClick={(event) => {
                    event.stopPropagation();
                    if (!loading) {
                      openModal('tagCreatePost', {
                        arrayTags: arrayTags,
                        setArrayTags: setArrayTags
                      });
                    }
                  }}
                  disabled={!arrayTags || loading}
                />
                <div className="hidden lg:flex">
                  <Button.Action
                    id="emoji-btn"
                    variant="custom"
                    icon={<Icon.Smiley size="32" />}
                    onClick={(event) => {
                      event.stopPropagation();
                      !loading && setShowEmojis(true);
                    }}
                    disabled={loading}
                  />
                </div>
                {article && (
                  <div className="hidden lg:flex">
                    <Button.Action
                      id="article-btn"
                      variant="custom"
                      icon={<Icon.Newspaper size="32" />}
                      onClick={(event) => {
                        event.stopPropagation();
                        if (!loading) openModal('createArticle', { setShowModalPost });
                      }}
                      disabled={loading}
                    />
                  </div>
                )}
                {!noFile && (
                  <Button.Action
                    id="media-upload-btn"
                    variant="custom"
                    icon={<Icon.ImageSquare size="32" color={!selectedFiles ? 'gray' : 'white'} />}
                    onClick={() => !loading && document.getElementById('fileInput')?.click()}
                    disabled={!selectedFiles || loading}
                  >
                    <input
                      id="fileInput"
                      type="file"
                      accept="image/*,video/*,audio/*,.pdf"
                      className="hidden"
                      onChange={handleFileChange}
                      disabled={!selectedFiles || loading}
                      multiple
                    />
                  </Button.Action>
                )}

                {button}
              </div>
            </div>
          </Post.Actions>
        </>
      )}
    </>
  );
}
