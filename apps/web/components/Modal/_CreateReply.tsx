import {
  Button,
  Icon,
  Input,
  Modal as ModalUI,
  Post as PostUI,
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
import Modal, { Modal as ModalComponent } from '.';
import { IPost, IUserProfile } from '@/types';
import { Utils } from '@social/utils-shared';
import LinkPreviewer from '../LinkPreview';
import { useRouter } from 'next/navigation';
import Post from '../Post';
import FilePreview from '../FilePreview';

interface CreateReplyProps {
  showModalReply: boolean;
  setShowModalReply: React.Dispatch<React.SetStateAction<boolean>>;
  post: IPost;
}

export default function CreateReply({
  showModalReply,
  setShowModalReply,
  post,
}: CreateReplyProps) {
  const router = useRouter();
  const { pubky, getProfile, createReply, createTag, searchUsers } =
    useClientContext();
  const { setContent, setShow } = useAlertContext();
  const [name, setName] = useState('');
  const [pic, setPic] = useState('/images/Userpic.png');
  const [contentReply, setContentReply] = useState('');
  const [isValidContent, setIsValidContent] = useState(false);
  const [sendingReply, setSendingReply] = useState(false);
  const [showModalTag, setShowModalTag] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [arrayTags, setArrayTags] = useState<string[]>([]);
  const [cursorPosition, setCursorPosition] = useState<number>(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const wrapperRefEmojis = useRef<HTMLDivElement>(null);
  const modalReplyRef = useRef<HTMLDivElement>(null);
  const [searchedUsers, setSearchedUsers] = useState<IUserProfile[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  const handleUserClick = (userId: string) => {
    const regex = /@\w+/;
    const newContent = contentReply.replace(regex, `pk:${userId}`);

    setContentReply(newContent);
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
      searchUsername(contentReply);
    }, 500);

    setDebounceTimeout(timeout);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentReply]);

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

  const handleSubmit = async (content: string) => {
    if (sendingReply) {
      return;
    }
    try {
      setSendingReply(true);

      const hashtags = Utils.extractHashtags(content);
      const updatedTags = [...new Set([...arrayTags, ...hashtags])];
      const rootUri = post.post.root ? post.post.root : post.uri;

      const newReply = await createReply(
        content,
        post.uri,
        rootUri,
        selectedFiles
      );

      if (newReply) {
        for (const tag of updatedTags) {
          await createTag(newReply.uri, tag);
        }
        setContent('Reply created!');
        setShow(true);
      } else {
        setContent('Something wrong. Try again', 'warning');
        setShow(true);
      }
      setArrayTags([]);
      setContentReply('');
      setShowModalReply(false);
      setSelectedFiles([]);
    } catch (error) {
      console.log(error);
    } finally {
      setSendingReply(false);
    }
  };

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
        handleSubmit(contentReply);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValidContent, contentReply]);

  const handleEmojiClick = (emojiObject: EmojiClickData) => {
    const textBeforeCursor = contentReply.slice(0, cursorPosition);
    const textAfterCursor = contentReply.slice(cursorPosition);
    const newText = textBeforeCursor + emojiObject.emoji + textAfterCursor;

    setContentReply(newText);
    setCursorPosition(cursorPosition + emojiObject.emoji.length);
    setIsValidContent(Utils.isValidContent(newText));
  };

  useEffect(() => {
    const handleClickOutsideModals = (event: MouseEvent) => {
      if (
        modalReplyRef.current &&
        !modalReplyRef.current.contains(event.target as Node)
      ) {
        setShowModalReply(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutsideModals);

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideModals);
    };
  }, [modalReplyRef, setShowModalReply]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    const maxSizeInMB = 6;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

    if (files) {
      const validFiles = Array.from(files).filter((file) => {
        if (file.size > maxSizeInBytes) {
          setContent('The maximum allowed size is 6 MB', 'warning');
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
                setContent('Maximum of 3 files can be uploaded', 'warning');
                setShow(true);
              }
            } else {
              setContent('File not supported', 'warning');
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
  }, [selectedFiles, setContent, setShow]);

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
          setContent('File not supported', 'warning');
          setShow(true);
          return false;
        }
        if (file.size > maxSizeInBytes) {
          setContent('The maximum allowed size is 6 MB', 'warning');
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
    <ModalUI.Root
      modalRef={modalReplyRef}
      show={showModalReply}
      closeModal={() => {
        setShowModalReply(false);
        setArrayTags([]);
      }}
      className="w-[792px] max-w-[1200px] max-h-[600px] overflow-y-auto"
    >
      <ModalUI.CloseAction
        onClick={() => {
          setShowModalReply(false);
          setArrayTags([]);
          setContent('');
        }}
      />
      <ModalUI.Header title="Reply" />
      <Post
        post={post}
        repostView
        className="mt-2 max-h-[600px] overflow-y-auto rounded-bl-none"
      />
      <div className="flex items-center relative">
        <div
          className={`absolute border-l-2 h-full border-neutral-800 after:content-[' * '] after:bg-neutral-800 after:w-[1.5px] after:h-[12px] after:block after:-mt-[12px] after:-ml-[1px]`}
        />
        <div className="absolute ml-[1px] w-3.5 border-t-2 border-neutral-800" />

        <div className="w-full ml-[15px] p-6 mt-6 rounded-2xl border-dashed border border-white border-opacity-30">
          <ModalUI.Content className="flex flex-row gap-6 max-h-[300px] overflow-y-auto">
            <div className="rounded-2xl flex-col justify-start items-start inline-flex w-full min-w-[300px] md:min-w-[500px]">
              <div className="justify-start items-center gap-3 flex">
                <Image
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full"
                  alt="user-image"
                  src={pic}
                />
                {name && pubky ? (
                  <div
                    className="cursor-pointer flex gap-4 items-center"
                    onClick={() => router.push('/profile')}
                  >
                    <Typography.Body
                      className={`hover:underline hover:decoration-solid`}
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
                  <Typography.Body
                    variant="medium-bold"
                    className="text-opacity-50"
                  >
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
                      setContentReply(e.target.value);
                      setCursorPosition(e.target.selectionStart);
                      setIsValidContent(Utils.isValidContent(e.target.value));
                    }}
                    onSelect={(
                      e: React.SyntheticEvent<HTMLTextAreaElement>
                    ) => {
                      setCursorPosition(e.currentTarget.selectionStart);
                    }}
                    value={contentReply}
                    maxLength={300}
                    autoFocus
                    className={`w-full h-auto mt-4`}
                    placeholder="What's on your mind?"
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
                <LinkPreviewer content={contentReply} />
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
              </div>
              <ModalComponent.TagCreatePost
                arrayTags={arrayTags}
                setArrayTags={setArrayTags}
                showModalTag={showModalTag}
                setShowModalTag={setShowModalTag}
              />
            </div>
          </ModalUI.Content>
          <PostUI.Actions className="w-full">
            {arrayTags.length > 0 && (
              <div className="inline-flex gap-2 mt-2">
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
                className="absolute translate-y-[10%] translate-x-[30%] z-10"
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
              {contentReply.length} / 300
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
            <Button.Medium
              className="w-auto"
              variant="line"
              icon={
                <Icon.ChatCircleText
                  color={
                    !isValidContent && selectedFiles.length === 0
                      ? 'gray'
                      : 'white'
                  }
                />
              }
              disabled={!isValidContent && selectedFiles.length === 0}
              loading={sendingReply}
              onClick={
                (isValidContent || selectedFiles.length > 0) && !sendingReply
                  ? () => handleSubmit(contentReply)
                  : undefined
              }
            >
              Reply
            </Button.Medium>
          </PostUI.Actions>
        </div>
      </div>
    </ModalUI.Root>
  );
}
