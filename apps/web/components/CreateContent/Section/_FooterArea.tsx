'use client';

import { Button, Icon, Post, PostUtil } from '@social/ui-shared';
import EmojiPicker, {
  EmojiClickData,
  EmojiStyle,
  Theme,
} from 'emoji-picker-react';
import { Utils } from '@social/utils-shared';
import { useAlertContext } from '@/contexts';

interface FooterAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  visibleTextArea: boolean;
  textArea: boolean | undefined;
  content: string;
  setContent: (content: string) => void;
  showModalTag: boolean;
  cursorPosition: number;
  setCursorPosition: React.Dispatch<React.SetStateAction<number>>;
  setIsValidContent: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>;
  selectedFiles: File[];
  setArrayTags: React.Dispatch<React.SetStateAction<string[]>>;
  arrayTags: string[];
  setFilePreviews: React.Dispatch<React.SetStateAction<string[]>>;
  showEmojis: boolean;
  setShowEmojis: React.Dispatch<React.SetStateAction<boolean>>;
  largeView: boolean;
  button: React.ReactNode;
  wrapperRefEmojis: React.RefObject<HTMLDivElement>;
  setShowModalTag: React.Dispatch<React.SetStateAction<boolean>>;
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
}: FooterAreaProps) {
  const { setContent: setContentAlert, setShow } = useAlertContext();

  const handleEmojiClick = (emojiObject: EmojiClickData) => {
    const textBeforeCursor = content.slice(0, cursorPosition);
    const textAfterCursor = content.slice(cursorPosition);
    const newText = textBeforeCursor + emojiObject.emoji + textAfterCursor;

    setContent(newText);
    setCursorPosition(cursorPosition + emojiObject.emoji.length);
    setIsValidContent(Utils.isValidContent(newText));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    const maxSizeInMB = 6;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

    if (files) {
      const validFiles = Array.from(files).filter((file) => {
        if (file.size > maxSizeInBytes) {
          setContentAlert('The maximum allowed size is 6 MB', 'warning');
          setShow(true);
          return false;
        }
        return true;
      });

      const newFiles = validFiles.slice(0, 3 - selectedFiles.length);
      setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles].slice(0, 3));

      const newFilePreviews = newFiles.map((file) => URL.createObjectURL(file));
      setFilePreviews((prevPreviews) =>
        [...prevPreviews, ...newFilePreviews].slice(0, 3)
      );
    }
  };

  return (
    <>
      {(visibleTextArea ||
        textArea ||
        content ||
        showModalTag ||
        arrayTags.length > 0) && (
        <Post.Actions className="w-full">
          {arrayTags.length > 0 && (
            <div className="gap-2 flex h-full items-center">
              {arrayTags.map((tag, index) => (
                <PostUtil.Tag
                  key={index}
                  clicked
                  color={tag && Utils.generateRandomColor(tag)}
                  action={
                    <div
                      className="flex items-center"
                      onClick={() =>
                        setArrayTags((prev) =>
                          prev.filter((item) => item !== tag)
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
          {showEmojis && (
            <div
              id='emoji-picker'
              className={`absolute translate-y-[10%] ${
                largeView
                  ? 'translate-x-[0%] md:translate-x-[30%] lg:translate-x-[80%] xl:translate-x-[165%]'
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
          <div id ='content-length' className="text-opacity-30 text-white text-sm mt-4 mr-2">
            {content.length} / 300
          </div>
          <Button.Action
            id='tag-btn'
            variant="custom"
            icon={<Icon.Tag size="32" />}
            onClick={(event) => {
              event.stopPropagation();
              setShowModalTag(true);
            }}
          />
          <Button.Action
            id='emoji-btn'
            variant="custom"
            icon={<Icon.Smiley size="32" />}
            onClick={(event) => {
              event.stopPropagation();
              setShowEmojis(true);
            }}
          />
          <Button.Action
            id='media-upload-btn'
            variant="custom"
            icon={<Icon.ImageSquare size="32" />}
            onClick={() => document.getElementById('fileInput')?.click()}
          >
            <input
              id="fileInput"
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={handleFileChange}
              multiple
            />
          </Button.Action>
          {button}
        </Post.Actions>
      )}
    </>
  );
}
