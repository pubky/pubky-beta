'use client';

import { Button, Icon, Input, Post, PostUtil, Typography } from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import { useAlertContext, useModal } from '@/contexts';
import { useEffect, useRef, useState } from 'react';
import EmojiPicker from '@/components/EmojiPicker';
import { useDrawerClickOutside } from '@/hooks/useDrawerClickOutside';
import { useSuggestedTags } from '@/hooks/useSuggestedTags';

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
  noEmoji?: boolean;
  noFile?: boolean;
  maxLength?: number;
  setShowModalPost?: React.Dispatch<React.SetStateAction<boolean>>;
  isError?: boolean;
  loading: boolean;
  charCountArticle?: number;
  setIsCompressing?: React.Dispatch<React.SetStateAction<boolean>>;
  filesBeingCompressed?: number;
  setFilesBeingCompressed?: React.Dispatch<React.SetStateAction<number>>;
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
  noEmoji,
  noFile,
  maxLength = 1000,
  setShowModalPost,
  isError,
  loading,
  setIsCompressing,
  filesBeingCompressed,
  setFilesBeingCompressed
  // charCountArticle
}: FooterAreaProps) {
  const { addAlert, removeAlert } = useAlertContext();
  const { openModal } = useModal();
  const [addTagInput, setAddTagInput] = useState<boolean>(false);
  const [tagInput, setTagInput] = useState('');
  const [errorTag, setErrorTag] = useState(false);
  const [showEmojisFastTag, setShowEmojisFastTag] = useState(false);
  const wrapperRefEmojisFastTag = useRef<HTMLDivElement>(null);
  useDrawerClickOutside(wrapperRefEmojisFastTag, () => setShowEmojisFastTag(false));

  // Tag suggestion logic
  const { suggestedTags, selectedTagIndex, handleKeyDown, handleTagClick } = useSuggestedTags({
    tagInput,
    onTagSelect: (tag) => setTagInput(tag)
  });

  const handleAddTagWithCheck = (tag: string) => {
    if (selectedTagIndex > -1) {
      const selectedTag = suggestedTags[selectedTagIndex];
      setTagInput(selectedTag);
    } else {
      handleAddTag();
    }
  };

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

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    const maxImageSizeInMB = 5;
    const maxOtherSizeInMB = 20;
    const maxVideoSizeForCompressionInMB = 100;
    const maxImageSizeInBytes = maxImageSizeInMB * 1024 * 1024;
    const maxOtherSizeInBytes = maxOtherSizeInMB * 1024 * 1024;
    const maxVideoSizeForCompressionInBytes = maxVideoSizeForCompressionInMB * 1024 * 1024;

    if (files) {
      // Check file limit before processing - include files being compressed
      const totalFiles = (selectedFiles?.length || 0) + files.length + (filesBeingCompressed || 0);
      if (totalFiles > 4) {
        addAlert('Max 4 files only.', 'warning');
      }

      const processFiles = async () => {
        const validFiles: File[] = [];

        for (const file of Array.from(files)) {
          // Check if we already have 4 files - include files being compressed
          if (validFiles.length >= 4 - (selectedFiles?.length || 0) - (filesBeingCompressed || 0)) {
            break;
          }

          const isImage = file.type.startsWith('image/');
          const isVideo = file.type.startsWith('video/');
          const isAudio = file.type.startsWith('audio/');
          const isPDF = file.type === 'application/pdf';
          const isValidType =
            (isImage && Utils.supportedImageTypes.includes(file.type)) ||
            (isVideo && Utils.supportedVideoTypes.includes(file.type)) ||
            (isAudio && Utils.supportedAudioTypes.includes(file.type)) ||
            isPDF;

          if (!isValidType) {
            addAlert('File type not supported.', 'warning');
            continue;
          }

          if (isImage && file.size > maxImageSizeInBytes) {
            try {
              const loadingAlertId = addAlert(
                `Compressing image ${validFiles.length + 1}/${files.length}...`,
                'loading'
              );
              setIsCompressing(true);
              setFilesBeingCompressed && setFilesBeingCompressed((prev) => prev + 1);
              const resizedFile = await Utils.resizeImageFile(file, maxImageSizeInBytes);
              removeAlert(loadingAlertId);
              validFiles.push(resizedFile);
            } catch (error) {
              addAlert('The maximum allowed size for images is 5 MB', 'warning');
              continue;
            } finally {
              setFilesBeingCompressed && setFilesBeingCompressed((prev) => Math.max(0, prev - 1));
              // Only set compressing to false when all files are processed
              if (validFiles.length === files.length) {
                setIsCompressing(false);
              }
            }
          } else if (isVideo && file.size > maxOtherSizeInBytes) {
            // Check if video is too large for compression
            if (file.size > maxVideoSizeForCompressionInBytes) {
              addAlert('The maximum allowed size for videos compression is 100 MB', 'warning');
              continue;
            }
            try {
              const loadingAlertId = addAlert(
                `Compressing video ${validFiles.length + 1}/${files.length}...`,
                'loading'
              );
              setIsCompressing(true);
              setFilesBeingCompressed && setFilesBeingCompressed((prev) => prev + 1);
              const resizedFile = await Utils.resizeVideoFile(file, maxOtherSizeInBytes);
              removeAlert(loadingAlertId);
              validFiles.push(resizedFile);
            } catch (error) {
              addAlert('The maximum allowed size for videos is 20 MB', 'warning');
              continue;
            } finally {
              setFilesBeingCompressed && setFilesBeingCompressed((prev) => Math.max(0, prev - 1));
              // Only set compressing to false when all videos are processed
              if (validFiles.length === files.length) {
                setIsCompressing(false);
              }
            }
          } else if (!isImage && !isVideo && file.size > maxOtherSizeInBytes) {
            addAlert('The maximum allowed size is 20 MB', 'warning');
            continue;
          } else {
            validFiles.push(file);
          }
        }

        const newFiles = validFiles.slice(0, 4 - (selectedFiles?.length || 0));
        const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
        const updatedPreviews = [...filePreviews, ...newPreviews].slice(0, 4);

        setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles].slice(0, 4));
        setFilePreviews(updatedPreviews);

        if (updatedPreviews.length < filePreviews.length) {
          filePreviews.slice(updatedPreviews.length).forEach((preview) => URL.revokeObjectURL(preview));
        }

        // Ensure compressing state is reset if no files needed compression
        if (validFiles.length === 0) {
          setIsCompressing(false);
        }
      };

      await processFiles();
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
      if (prevTags.length > 5) {
        setErrorTag(true);
        return prevTags;
      } else {
        setTagInput('');
        return [...prevTags, tagInput.trim()];
      }
    });
  };

  useEffect(() => {
    if (!textArea) {
      setTagInput('');
      setAddTagInput(false);
    }
  }, [textArea]);

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
                        if (arrayTags.length < 5) {
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
                <>
                  {showEmojisFastTag && (
                    <div className="absolute translate-y-[10%] translate-x-[30%] z-10" ref={wrapperRefEmojisFastTag}>
                      <EmojiPicker
                        onEmojiSelect={(emojiObject) => {
                          setTagInput(tagInput + emojiObject.native);
                          setShowEmojisFastTag(false);
                        }}
                        maxLength={20}
                        currentInput={tagInput}
                      />
                    </div>
                  )}

                  {/* Wrap Input.Tag in a relative div for key handling and suggestions */}
                  <div className="relative" onKeyDown={handleKeyDown} tabIndex={0}>
                    <Input.Tag
                      value={tagInput}
                      onChange={setTagInput}
                      onAddTag={handleAddTagWithCheck}
                      onEmojiPickerClick={() => setShowEmojisFastTag(true)}
                      showCloseButton
                      onClose={() => setAddTagInput(false)}
                      variant="small"
                      autoFocus
                    />
                    {suggestedTags.length > 0 && (
                      <div className="absolute top-full left-0 mt-1 bg-[#05050A] border border-white border-opacity-20 rounded-lg z-20 w-[200px] max-h-[150px] overflow-y-auto scrollbar-thin scrollbar-webkit">
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

                  {errorTag && addTagInput && (
                    <Typography.Body className="whitespace-nowrap text-[#e95164]" variant="small">
                      Max 6 tags
                    </Typography.Body>
                  )}
                </>
              ) : (
                <div
                  id="show-add-tag-input-btn"
                  onClick={() => setArrayTags && setAddTagInput(true)}
                  className={`${setArrayTags ? 'cursor-pointer opacity-30 hover:opacity-50' : 'cursor-not-allowed opacity-15'} relative w-8 h-8 rounded-lg border border-white border-dashed justify-center items-center gap-1 inline-flex`}
                >
                  <div>
                    <Icon.Plus size="16" />
                  </div>
                </div>
              )}
            </div>
            <div className="grow" />
            <div className="w-full justify-between sm:justify-end flex flex-col min-[375px]:flex-row gap-2">
              {isError && (
                <Typography.Body className="self-center text-[#e95164]" variant="small">
                  Content too long, reduce it and try again
                </Typography.Body>
              )}
              <div id="content-length" className="whitespace-nowrap text-opacity-30 text-white text-sm mt-4 mr-2">
                {!noFile && `${content.length} / ${maxLength}`}
              </div>
              <div className="flex gap-2">
                <Button.Action
                  id="tag-btn"
                  variant="custom"
                  className="flex lg:hidden"
                  icon={<Icon.Tag size="32" color={!arrayTags ? 'gray' : 'white'} />}
                  onClick={(event) => {
                    if (!arrayTags || loading) return;
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
                {!noEmoji && (
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
                )}
                {article && (
                  <div className="flex">
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
