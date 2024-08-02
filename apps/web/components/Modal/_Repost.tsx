import {
  Button,
  Icon,
  Input,
  Modal as ModalUI,
  Post as PostElement,
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
import { Utils } from '@social/utils-shared';
import { IPost, IUserProfile } from '@/types';
import Post from '../Post';
import LinkPreviewer from '@/components/LinkPreview';
import { useRouter } from 'next/navigation';
import FilePreview from '../FilePreview';

interface CreateRepostProps {
  showModalRepost: boolean;
  setShowModalRepost: React.Dispatch<React.SetStateAction<boolean>>;
  modalRepostRef: React.RefObject<HTMLDivElement>;
  post: IPost;
  handleRepost: () => Promise<void>;
}

export default function Repost({
  showModalRepost,
  setShowModalRepost,
  modalRepostRef,
  post,
  handleRepost,
}: CreateRepostProps) {
  const router = useRouter();
  const { pubky, getProfile, createRepost, createTag, searchUsers } =
    useClientContext();
  const { setContent, setShow } = useAlertContext();
  const [name, setName] = useState('');
  const [pic, setPic] = useState('/images/Userpic.png');
  const [contentRepost, setContentRepost] = useState('');
  const [isValidContent, setIsValidContent] = useState(false);
  const [sendingRepost, setSendingRepost] = useState(false);
  const [showModalTag, setShowModalTag] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [arrayTags, setArrayTags] = useState<string[]>([]);
  const [cursorPosition, setCursorPosition] = useState<number>(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const wrapperRefEmojis = useRef<HTMLDivElement>(null);
  const [searchedUsers, setSearchedUsers] = useState<IUserProfile[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  const handleUserClick = (userId: string) => {
    const regex = /@\w+/;
    const newContent = contentRepost.replace(regex, `pk:${userId}`);

    setContentRepost(newContent);
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
      searchUsername(contentRepost);
    }, 500);

    setDebounceTimeout(timeout);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentRepost]);

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

  const handleSubmitRepost = async (content: string) => {
    if (sendingRepost) {
      return;
    }
    try {
      setSendingRepost(true);
      const hashtags = Utils.extractHashtags(content);
      const updatedTags = [...new Set([...arrayTags, ...hashtags])];

      const newRepost = await createRepost(post.uri, content, selectedFiles);

      if (newRepost) {
        for (const tag of updatedTags) {
          await createTag(newRepost.uri, tag);
        }
        setContent('Repost created!');
        setShow(true);
      } else {
        setContent('Something wrong. Try again', 'warning');
        setShow(true);
      }
      setArrayTags([]);
      setContentRepost('');
      setShowModalRepost(false);
      setSelectedFiles([]);
    } catch (error) {
      console.log(error);
    } finally {
      setSendingRepost(false);
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
        handleSubmitRepost(contentRepost);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValidContent, contentRepost]);

  const handleEmojiClick = (emojiObject: EmojiClickData) => {
    const textBeforeCursor = contentRepost.slice(0, cursorPosition);
    const textAfterCursor = contentRepost.slice(cursorPosition);
    const newText = textBeforeCursor + emojiObject.emoji + textAfterCursor;
    setContentRepost(newText);
    setCursorPosition(cursorPosition + emojiObject.emoji.length);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files).slice(0, 3 - selectedFiles.length);
      setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles].slice(0, 3));
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <ModalUI.Root
      modalRef={modalRepostRef}
      show={showModalRepost}
      closeModal={() => {
        setShowModalRepost(false);
        setArrayTags([]);
      }}
      className="w-[792px] max-w-[1200px]"
    >
      <ModalUI.CloseAction
        onClick={() => {
          setShowModalRepost(false);
          setArrayTags([]);
          setContent('');
        }}
      />
      <ModalUI.Header title="Repost" />
      <div className="p-6 mt-6 rounded-2xl border-dashed border border-white border-opacity-30">
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
              <div className="w-full relative">
                <Input.CursorArea
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                    setContentRepost(e.target.value);
                    setCursorPosition(e.target.selectionStart);
                    setIsValidContent(Utils.isValidContent(e.target.value));
                  }}
                  onSelect={(e: React.SyntheticEvent<HTMLTextAreaElement>) => {
                    setCursorPosition(e.currentTarget.selectionStart);
                  }}
                  value={contentRepost}
                  maxLength={300}
                  autoFocus
                  className={`w-full h-auto mt-4`}
                  placeholder="Optional comment"
                />
                {searchedUsers.length > 0 && (
                  <Modal.SearchedUsersCard
                    handleUserClick={handleUserClick}
                    searchedUsers={searchedUsers}
                  />
                )}
              </div>
              <LinkPreviewer content={contentRepost} />
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
              <Post post={post} repostView className="mt-2" />
            </div>
            <ModalComponent.TagCreatePost
              arrayTags={arrayTags}
              setArrayTags={setArrayTags}
              showModalTag={showModalTag}
              setShowModalTag={setShowModalTag}
            />
          </div>
        </ModalUI.Content>
        <PostElement.Actions className="w-full">
          {arrayTags.length > 0 && (
            <div className="inline-flex gap-2 mt-2">
              {arrayTags.map((tag, index) => (
                <PostUtil.Tag
                  key={index}
                  clicked
                  color="fuchsia"
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
            {contentRepost.length} / 300
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
            icon={<Icon.Repost color="white" />}
            loading={sendingRepost}
            onClick={
              !sendingRepost
                ? isValidContent
                  ? () => handleSubmitRepost(contentRepost)
                  : () => {
                      setSendingRepost(true);
                      handleRepost();
                      setShowModalRepost(false);
                      setSendingRepost(false);
                    }
                : undefined
            }
            //icon={<Icon.Repost color={!isValidContent ? 'gray' : 'white'} />}
            //disabled={!isValidContent}
            //onClick={
            //  isValidContent && !sendingRepost
            //</PostElement.Actions>    ? () => handleSubmitRepost()
            //    : undefined
            // }
          >
            Repost
          </Button.Medium>
        </PostElement.Actions>
      </div>
    </ModalUI.Root>
  );
}
