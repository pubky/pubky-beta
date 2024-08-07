'use client';

import {
  Button,
  Icon,
  Input,
  Post,
  PostUtil,
  Typography,
} from '@social/ui-shared';
import { useEffect, useRef, useState } from 'react';
import EmojiPicker, {
  EmojiClickData,
  EmojiStyle,
  Theme,
} from 'emoji-picker-react';
import { useClientContext, useAlertContext } from '@/contexts';
import Image from 'next/image';
import { IUserProfile } from '@/types';
import Modal from '../Modal';
import { Utils } from '@social/utils-shared';
import LinkPreviewer from '../LinkPreview';
import { useRouter } from 'next/navigation';
import FilePreview from '../FilePreview';

interface CreateContentProps extends React.HTMLAttributes<HTMLDivElement> {
  largeView?: boolean;
  autoFocus?: boolean;
  visibleTextArea?: boolean;
  handleSubmit: (content: string) => Promise<void>;
  setContent: (content: string) => void;
  content: string;
  textArea?: boolean;
  setTextArea?: React.Dispatch<React.SetStateAction<boolean>>;
  button: React.ReactNode;
  isValidContent: boolean;
  setIsValidContent: React.Dispatch<React.SetStateAction<boolean>>;
  placeHolder?: string;
  children?: React.ReactNode;
}

export default function CreateContent({
  largeView = false,
  autoFocus,
  visibleTextArea = false,
  handleSubmit,
  setContent,
  content,
  textArea,
  setTextArea,
  button,
  isValidContent,
  setIsValidContent,
  placeHolder = "What's on your mind?",
  children,
}: CreateContentProps) {
  const { pubky, getProfile, searchUsers } = useClientContext();
  const router = useRouter();
  const { setContent: setContentAlert, setShow } = useAlertContext();
  const [name, setName] = useState('');
  const [pic, setPic] = useState('/images/Userpic.png');
  const [showModalTag, setShowModalTag] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [arrayTags, setArrayTags] = useState<string[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const wrapperRefEmojis = useRef<HTMLDivElement>(null);
  const [cursorPosition, setCursorPosition] = useState<number>(0);
  const [searchedUsers, setSearchedUsers] = useState<IUserProfile[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  const handleUserClick = (userId: string) => {
    const regex = /@\w+/;
    const newContent = content.replace(regex, `pk:${userId}`);

    setContent(newContent);
    setSearchedUsers([]);
  };

  const searchProfiles = async (text: string) => {
    try {
      const result = await searchUsers(text);
      return result || [];
    } catch (error) {
      console.error('Error searching profiles:', error);
      return [];
    }
  };

  const searchUsername = async (content: string) => {
    const pkMatches = content.match(/(pk:[^\s]+)/g);
    const atMatches = content.match(/(@[^\s]+)/g);

    const searchQueries = [...(pkMatches || []), ...(atMatches || [])];

    if (searchQueries.length === 0) {
      setSearchedUsers([]);
      return;
    }

    let results: IUserProfile[] = [];

    for (const query of searchQueries) {
      if (query.startsWith('@')) {
        const username = query.slice(1);
        const searchResult = await searchUsers(username);
        results = [...results, ...(searchResult || [])];
      } else if (query.startsWith('pk:')) {
        const searchResult = await searchProfiles(query);
        results = [...results, ...(searchResult || [])];
      }
    }
    setSearchedUsers(results.length > 0 ? results : []);
  };

  useEffect(() => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const timeout = setTimeout(() => {
      searchUsername(content);
    }, 500);

    setDebounceTimeout(timeout);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  async function fetchProfile() {
    try {
      if (!pubky) return;
      const userProfile = await getProfile();

      if (userProfile) {
        setPic(userProfile?.image || '/images/Userpic.png');
        setName(userProfile?.name);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pubky]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowEmojis(false);
        if (setTextArea) setTextArea(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef, content, setTextArea]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRefEmojis.current &&
        !wrapperRefEmojis.current.contains(event.target as Node)
      ) {
        setShowEmojis(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRefEmojis]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key === 'Enter' &&
        isValidContent
      ) {
        handleSubmit(content);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValidContent, content]);

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
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      if (!textArea) return;

      const items = event.clipboardData?.items;
      if (items) {
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          if (item.kind === 'file') {
            const file = item.getAsFile();
            if (
              file &&
              (file.type.startsWith('image/') || file.type.startsWith('video/'))
            ) {
              if (selectedFiles.length < 3) {
                setSelectedFiles((prevFiles) => [...prevFiles, file]);
              } else {
                setContentAlert(
                  'Maximum of 3 files can be uploaded',
                  'warning'
                );
                setShow(true);
              }
            } else {
              setContentAlert('File not supported', 'warning');
              setShow(true);
            }
          }
        }
      }
    };

    document.addEventListener('paste', handlePaste);

    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, [selectedFiles, setContentAlert, setShow, textArea]);

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.items && event.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = 'copy';
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    const files = event.dataTransfer.files;
    const maxSizeInMB = 6;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

    if (files) {
      const validFiles = Array.from(files).filter((file) => {
        const isValidType =
          file.type.startsWith('image/') || file.type.startsWith('video/');
        if (!isValidType) {
          setContentAlert('File not supported', 'warning');
          setShow(true);
          return false;
        }
        if (file.size > maxSizeInBytes) {
          setContentAlert('The maximum allowed size is 6 MB', 'warning');
          setShow(true);
          return false;
        }
        return true;
      });

      const newFiles = validFiles.slice(0, 3 - selectedFiles.length);
      setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles].slice(0, 3));
    }
  };

  return (
    <div
      className={`${
        largeView ? 'p-12' : 'p-6'
      } w-full mb-4 rounded-2xl border-dashed border border-white border-opacity-30 flex-col justify-start items-start inline-flex`}
    >
      <div className="justify-start items-center gap-3 flex">
        <Image
          width={largeView ? 48 : 32}
          height={largeView ? 48 : 32}
          className={`${
            largeView ? 'w-[48px] h-[48px]' : 'w-[32px] h-[32px]'
          } rounded-full`}
          alt="user-image"
          src={pic}
        />
        {name && pubky ? (
          <div
            className="cursor-pointer flex gap-4 items-center"
            onClick={() => router.push('/profile')}
          >
            <Typography.Body
              className={`${
                largeView && 'text-2xl'
              } hover:underline hover:decoration-solid`}
              variant="medium-bold"
            >
              {Utils.minifyText(name, 24)}
            </Typography.Body>
            <div className="flex gap-1 cursor-pointer">
              <Icon.CheckCircle size="16" color="gray" />
              <Typography.Label className="text-opacity-30">
                {Utils.minifyPubky(pubky)}
              </Typography.Label>
            </div>
          </div>
        ) : (
          <Typography.Body variant="medium-bold" className="text-opacity-50">
            Loading...
          </Typography.Body>
        )}
      </div>
      <div
        ref={wrapperRef}
        className="w-full flex justify-between gap-6 items-start flex-col"
      >
        <div
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className="w-full relative"
        >
          <Input.CursorArea
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
              setContent(e.target.value);
              setCursorPosition(e.target.selectionStart);
              setIsValidContent(Utils.isValidContent(e.target.value));
            }}
            onSelect={(e: React.SyntheticEvent<HTMLTextAreaElement>) => {
              setCursorPosition(e.currentTarget.selectionStart);
            }}
            autoFocus={autoFocus}
            value={content}
            maxLength={300}
            onClick={() => setTextArea && setTextArea(true)}
            className={`w-full max-h-[300px] h-auto mt-4 ${
              largeView && 'text-2xl min-h-[50px]'
            }`}
            placeholder={placeHolder}
          />
          {isDragging && (
            <div className="flex justify-center items-center z-50">
              <Icon.Plus size="64" color="gray" />
            </div>
          )}
          {searchedUsers.length > 0 && (
            <Modal.SearchedUsersCard
              handleUserClick={handleUserClick}
              searchedUsers={searchedUsers}
            />
          )}
        </div>
        <LinkPreviewer content={content} />
        {selectedFiles.length > 0 && (
          <div className="relative mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {selectedFiles.map((file, index) => (
              <FilePreview
                key={index}
                file={file}
                index={index}
                removeFile={removeFile}
              />
            ))}
          </div>
        )}
        {children}
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
            <div className="text-opacity-30 text-white text-sm mt-4 mr-2">
              {content.length} / 300
            </div>
            <Button.Action
              variant="custom"
              icon={<Icon.Tag size="32" />}
              onClick={(event) => {
                event.stopPropagation();
                setShowModalTag(true);
              }}
            />
            <Button.Action
              variant="custom"
              icon={<Icon.Smiley size="32" />}
              onClick={(event) => {
                event.stopPropagation();
                setShowEmojis(true);
              }}
            />
            <Button.Action
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
      </div>
      <Modal.TagCreatePost
        arrayTags={arrayTags}
        setArrayTags={setArrayTags}
        showModalTag={showModalTag}
        setShowModalTag={setShowModalTag}
      />
    </div>
  );
}
