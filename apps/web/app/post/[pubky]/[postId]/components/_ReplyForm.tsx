'use client';

import { useEffect, useRef, useState } from 'react';
import EmojiPicker, {
  EmojiClickData,
  EmojiStyle,
  Theme,
} from 'emoji-picker-react';
import {
  Icon,
  Button,
  Post,
  Input,
  PostUtil,
  Typography,
} from '@social/ui-shared';
import { useAlertContext, useClientContext } from '@/contexts';
import Modal from '@/components/Modal';
import { Utils } from '@social/utils-shared';
import { IPost, IUserProfile } from '@/types';
import LinkPreviewer from '@/components/LinkPreview';
import Partecipants from './_Partecipants';
import { IReply } from '@/types';
import { useRouter } from 'next/navigation';
import Replies from './_Replies';
import FilePreview from '@/components/FilePreview';

export default function ReplyForm({
  uri,
  post,
  updatePost,
  replies,
}: {
  uri: string;
  post: IPost;
  updatePost: () => void;
  replies: IReply;
}) {
  const router = useRouter();
  const { getProfile, pubky, createReply, createTag, searchUsers } =
    useClientContext();
  const { setContent, setShow } = useAlertContext();
  const [image, setImage] = useState('/images/Userpic.png');
  const [name, setName] = useState('');
  const [arrayTags, setArrayTags] = useState<string[]>([]);
  const [showModalTag, setShowModalTag] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const wrapperRefEmojis = useRef<HTMLDivElement>(null);
  const [isValidContent, setIsValidContent] = useState(false);
  const [textArea, setTextArea] = useState(false);
  const [contentReply, setContentReply] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [cursorPosition, setCursorPosition] = useState<number>(0);
  const [searchedUsers, setSearchedUsers] = useState<IUserProfile[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
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

  const handleReply = async (content: string) => {
    setSendingReply(true);
    const rootUri = post.post.root ? post.post.root : uri;
    const sendReply = await createReply(content, uri, rootUri, selectedFiles);

    const hashtags = Utils.extractHashtags(content);
    const updatedTags = [...new Set([...arrayTags, ...hashtags])];

    if (sendReply) {
      for (const tag of updatedTags) {
        await createTag(sendReply.uri, tag);
      }
      setSendingReply(false);
      setContentReply('');
      setArrayTags([]);
      setSelectedFiles([]);
      updatePost();
    }
  };

  useEffect(() => {
    async function fetchData() {
      const userProfile = await getProfile();
      if (userProfile) {
        setImage(userProfile.image || '/images/Userpic.png');
        setName(userProfile?.name);
      }
    }
    fetchData();
  }, [getProfile, pubky]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowEmojis(false);
        setTextArea(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef, contentReply]);

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
        handleReply(contentReply);
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

  return (
    <div ref={wrapperRef} className="grid gap-6 md:grid-cols-3">
      <Post.Root className="col-span-2">
        <Post.MainCard className="w-full p-6 bg-transparent border border-white border-opacity-30 border-dashed rounded-2xl">
          <div className="contents inline-flex gap-12">
            <Post.Header>
              <div className="justify-start gap-1 inline-flex flex-col">
                <div className="flex gap-2 items-center">
                  <Post.ImageUser
                    className="lg:w-12 lg:h-12 max-w-none h-none"
                    src={image}
                    alt="user"
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
                <div className="mt-2">
                  <div className="w-full relative">
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
                      onClick={() => setTextArea(true)}
                      value={contentReply}
                      maxLength={300}
                      className="h-[25px] max-h-[300px] w-[250px] md:w-[500px] lg:w-[650px]"
                      placeholder="What are your thoughts on this?"
                    />
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
              </div>
            </Post.Header>
            <div className="gap-3 inline-flex">
              {(textArea ||
                contentReply ||
                showModalTag ||
                arrayTags.length > 0) && (
                <>
                  <Post.Actions className="w-full mt-2">
                    {arrayTags.length > 0 && (
                      <div className="inline-flex gap-2">
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
                        className="absolute translate-y-[10%] translate-x-[55%] z-10"
                        ref={wrapperRefEmojis}
                      >
                        <EmojiPicker
                          theme={Theme.DARK}
                          emojiStyle={EmojiStyle.TWITTER}
                          onEmojiClick={handleEmojiClick}
                        />
                      </div>
                    )}
                  </Post.Actions>
                  <div className="text-opacity-30 text-white text-sm mt-4 mr-2 whitespace-nowrap">
                    {contentReply.length} / 300
                  </div>
                  <Button.Action
                    onClick={() => setShowModalTag(true)}
                    variant="custom"
                    icon={<Icon.Tag size="22" />}
                  />
                  <Button.Action
                    onClick={() => setShowEmojis(true)}
                    variant="custom"
                    icon={<Icon.Smiley size="22" />}
                  />
                  <Button.Action
                    variant="custom"
                    icon={<Icon.ImageSquare size="22" />}
                    onClick={() =>
                      document.getElementById('fileInput')?.click()
                    }
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
                        color={!isValidContent ? 'gray' : 'white'}
                      />
                    }
                    disabled={!isValidContent}
                    loading={sendingReply}
                    onClick={
                      isValidContent && !sendingReply
                        ? () => handleReply(contentReply)
                        : undefined
                    }
                  >
                    Reply
                  </Button.Medium>
                </>
              )}
            </div>
          </div>
        </Post.MainCard>
        <Replies repliesResponse={replies} />
        <Modal.TagCreatePost
          arrayTags={arrayTags}
          setArrayTags={setArrayTags}
          showModalTag={showModalTag}
          setShowModalTag={setShowModalTag}
        />
      </Post.Root>
      <Partecipants repliesResponse={replies} />
    </div>
  );
}
