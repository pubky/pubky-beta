'use client';

import { Button, Icon, Post, PostUtil } from '@social/ui-shared';
import EmojiPicker, {
  EmojiClickData,
  EmojiStyle,
  Theme,
} from 'emoji-picker-react';
import { Utils } from '@social/utils-shared';
import { useAlertContext } from '@/contexts';
import { useState } from 'react';
import Modal from '@/components/Modal';

interface FooterAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  visibleTextArea: boolean;
  textArea: boolean | undefined;
  content: string;
  setContent: (content: string) => void;
  showModalTag: boolean;
  cursorPosition: number;
  setCursorPosition: React.Dispatch<React.SetStateAction<number>>;
  setIsValidContent: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedFiles?: React.Dispatch<React.SetStateAction<File[]>>;
  selectedFiles?: File[];
  setArrayTags?: React.Dispatch<React.SetStateAction<string[]>>;
  arrayTags?: string[];
  setFilePreviews?: React.Dispatch<React.SetStateAction<string[]>>;
  showEmojis: boolean;
  setShowEmojis: React.Dispatch<React.SetStateAction<boolean>>;
  largeView: boolean;
  button: React.ReactNode;
  wrapperRefEmojis: React.RefObject<HTMLDivElement>;
  setShowModalTag: React.Dispatch<React.SetStateAction<boolean>>;
  article?: boolean;
  markdown?: boolean;
  noFile?: boolean;
  maxLength?: number;
  setShowModalPost?: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
}

export default function FooterArea({
  visibleTextArea,
  textArea,
  content,
  setContent,
  showModalTag,
  cursorPosition,
  setCursorPosition,
  setIsValidContent,
  setSelectedFiles,
  selectedFiles,
  setArrayTags,
  arrayTags,
  showEmojis,
  largeView,
  setFilePreviews,
  setShowEmojis,
  wrapperRefEmojis,
  setShowModalTag,
  button,
  article,
  markdown,
  noFile,
  maxLength = 1000,
  setShowModalPost,
  loading,
}: FooterAreaProps) {
  const { addAlert } = useAlertContext();
  const [openModalArticle, setOpenModalArticle] = useState(false);

  const handleEmojiClick = (emojiObject: EmojiClickData) => {
    const textBeforeCursor = content.slice(0, cursorPosition);
    const textAfterCursor = content.slice(cursorPosition);
    const newText = textBeforeCursor + emojiObject.emoji + textAfterCursor;

    if (newText.length <= maxLength) {
      setContent(newText);
      setCursorPosition(cursorPosition + emojiObject.emoji.length);
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

      if (selectedFiles && selectedFiles.length + validFiles.length > 3) {
        addAlert('Max 3 files only.', 'warning');
        return;
      }

      const newFiles =
        selectedFiles && validFiles.slice(0, 3 - selectedFiles.length);
      setSelectedFiles &&
        newFiles &&
        setSelectedFiles((prevFiles) =>
          [...prevFiles, ...newFiles].slice(0, 3),
        );

      const newFilePreviews =
        newFiles && newFiles.map((file) => URL.createObjectURL(file));
      newFilePreviews &&
        setFilePreviews &&
        setFilePreviews((prevPreviews) =>
          [...prevPreviews, ...newFilePreviews].slice(0, 3),
        );
    }
  };

  return (
    <>
      {(visibleTextArea ||
        textArea ||
        content ||
        showModalTag ||
        (arrayTags && arrayTags.length > 0)) && (
        <>
          {arrayTags && arrayTags.length > 0 && (
            <div id="tags" className="gap-2 flex h-full items-center">
              {arrayTags.map((tag, index) => (
                <PostUtil.Tag
                  key={index}
                  clicked
                  color={tag && Utils.generateRandomColor(tag)}
                  action={
                    <div
                      className="flex items-center"
                      onClick={() =>
                        !loading &&
                        setArrayTags &&
                        setArrayTags((prev) =>
                          prev.filter((item) => item !== tag),
                        )
                      }
                    >
                      <Icon.X size="16" />
                    </div>
                  }
                >
                  {Utils.minifyText(tag.replace(' ', ''))}
                </PostUtil.Tag>
              ))}
            </div>
          )}
          <Post.Actions className="w-full flex-col sm:flex-row">
            {showEmojis && (
              <div
                id="emoji-picker"
                className={`absolute translate-y-[10%] ${
                  largeView
                    ? 'translate-x-[0%] md:translate-x-[30%] lg:translate-x-[80%] xl:translate-x-[165%]'
                    : markdown
                      ? 'translate-x-[0%] md:translate-x-[150%]'
                      : 'translate-x-[30%]'
                } z-10`}
                ref={wrapperRefEmojis}
              >
                <EmojiPicker
                  theme={Theme.DARK}
                  emojiStyle={EmojiStyle.TWITTER}
                  onEmojiClick={handleEmojiClick}
                />
              </div>
            )}
            <div className="grow" />
            <div className="w-full justify-end flex gap-2">
              <div
                id="content-length"
                className="text-opacity-30 text-white text-sm mt-4 mr-2"
              >
                {content.length} / {maxLength}
              </div>
              <div className="hidden sm:flex gap-2">
                <Button.Action
                  id="tag-btn"
                  variant="custom"
                  icon={
                    <Icon.Tag size="32" color={!arrayTags ? 'gray' : 'white'} />
                  }
                  onClick={(event) => {
                    event.stopPropagation();
                    !loading && setShowModalTag(true);
                  }}
                  disabled={!arrayTags || loading}
                />
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
                {article && (
                  <Button.Action
                    variant="custom"
                    icon={<Icon.Newspaper size="32" />}
                    onClick={(event) => {
                      event.stopPropagation();
                      !loading && setOpenModalArticle(true);
                    }}
                    disabled={loading}
                  />
                )}
                {!noFile && (
                  <Button.Action
                    id="media-upload-btn"
                    variant="custom"
                    icon={
                      <Icon.ImageSquare
                        size="32"
                        color={!selectedFiles ? 'gray' : 'white'}
                      />
                    }
                    onClick={() =>
                      !loading && document.getElementById('fileInput')?.click()
                    }
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
              </div>
              {button}
            </div>
            <div className="w-full flex sm:hidden gap-2 mt-4 justify-end">
              <Button.Action
                id="tag-btn"
                variant="custom"
                icon={
                  <Icon.Tag size="32" color={!arrayTags ? 'gray' : 'white'} />
                }
                onClick={(event) => {
                  event.stopPropagation();
                  !loading && setShowModalTag(true);
                }}
                disabled={!arrayTags || loading}
              />
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
              {article && (
                <Button.Action
                  variant="custom"
                  icon={<Icon.Newspaper size="32" />}
                  onClick={(event) => {
                    event.stopPropagation();
                    !loading && setOpenModalArticle(true);
                  }}
                  disabled={loading}
                />
              )}
              {!noFile && (
                <Button.Action
                  id="media-upload-btn"
                  variant="custom"
                  icon={
                    <Icon.ImageSquare
                      size="32"
                      color={!selectedFiles ? 'gray' : 'white'}
                    />
                  }
                  onClick={() =>
                    !loading && document.getElementById('fileInput')?.click()
                  }
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
            </div>
          </Post.Actions>
          {openModalArticle && (
            <Modal.CreateArticle
              showModalArticle={openModalArticle}
              setShowModalArticle={setOpenModalArticle}
              setShowModalPost={setShowModalPost}
            />
          )}
        </>
      )}
    </>
  );
}
