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
import { INewPost } from '@/types';
import Modal from '../Modal';
import { Utils } from '@social/utils-shared';
import LinkPreviewer from '../LinkPreview';
import { useRouter } from 'next/navigation';

interface CreateQuickPostProps extends React.HTMLAttributes<HTMLDivElement> {
  largeView?: boolean;
}

export default function CreateQuickPost({
  largeView = false,
}: CreateQuickPostProps) {
  const { pubky, getProfile, createPost, setPosts, createTag } =
    useClientContext();
  const router = useRouter();
  const { setContent, setShow } = useAlertContext();
  const [name, setName] = useState('');
  const [pic, setPic] = useState('/images/Userpic.png');
  const [contentPost, setContentPost] = useState('');
  const [isValidContent, setIsValidContent] = useState(false);
  const [sendingPost, setSendingPost] = useState(false);
  const [showModalTag, setShowModalTag] = useState(false);
  const [textArea, setTextArea] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [arrayTags, setArrayTags] = useState<string[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const wrapperRefEmojis = useRef<HTMLDivElement>(null);
  const [cursorPosition, setCursorPosition] = useState<number>(0);

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
    if (sendingPost) {
      return;
    }
    try {
      setSendingPost(true);

      const hashtags = Utils.extractHashtags(content);
      const updatedTags = [...new Set([...arrayTags, ...hashtags])];

      const newPost = await createPost(content);
      if (newPost) {
        for (const tag of updatedTags) {
          await createTag(newPost.uri, tag);
        }

        const userProfile = await getProfile();

        if (userProfile) {
          newPost.tags = updatedTags.map((tag) => ({
            tag,
            count: 1,
            from: [
              {
                id: `${pubky}`,
                createdAt: Date.now(),
                indexedAt: Date.now(),
                author: {
                  id: `${pubky}`,
                  uri: `pubky:${pubky}`,
                  profile: userProfile,
                },
              },
            ],
          }));
        }
        setPosts((prev: INewPost) => ({
          ...{ [newPost.id]: newPost },
          ...prev,
        }));
        setContent('Post created!');
        setShow(true);
      } else {
        setContent('Something wrong. Try again', 'warning');
        setShow(true);
      }
      setArrayTags([]);
      setContentPost('');
      setTextArea(false);
    } catch (error) {
      console.log(error);
    } finally {
      setSendingPost(false);
    }
  };

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
  }, [wrapperRef, contentPost]);

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
        handleSubmit(contentPost);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValidContent, contentPost]);

  const handleEmojiClick = (emojiObject: EmojiClickData) => {
    const textBeforeCursor = contentPost.slice(0, cursorPosition);
    const textAfterCursor = contentPost.slice(cursorPosition);
    const newText = textBeforeCursor + emojiObject.emoji + textAfterCursor;
    setContentPost(newText);
    setCursorPosition(cursorPosition + emojiObject.emoji.length);
  };

  return (
    <div
      className={`${
        largeView ? 'p-12' : 'p-6'
      } mb-4 rounded-2xl border-dashed border border-white border-opacity-30 flex-col justify-start items-start inline-flex`}
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
        <Input.CursorArea
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setContentPost(e.target.value);
            setCursorPosition(e.target.selectionStart);
            setIsValidContent(Utils.isValidContent(e.target.value));
          }}
          onSelect={(e: React.SyntheticEvent<HTMLTextAreaElement>) => {
            setCursorPosition(e.currentTarget.selectionStart);
          }}
          value={contentPost}
          maxLength={300}
          onClick={() => setTextArea(true)}
          className={`w-full max-h-[300px] h-auto mt-4 ${
            largeView && 'text-2xl min-h-[50px]'
          }`}
          placeholder="What's on your mind?"
        />
        <LinkPreviewer content={contentPost} />
        {(textArea || contentPost || showModalTag || arrayTags.length > 0) && (
          <Post.Actions className="w-full">
            {arrayTags.length > 0 && (
              <div className="gap-2 flex h-full items-center">
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
              {contentPost.length} / 300
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
              disabled
              icon={<Icon.ImageSquare color={'gray'} size="32" />}
            />
            <Button.Medium
              className="w-[104px]"
              variant="line"
              icon={
                <Icon.PaperPlaneRight
                  color={!isValidContent ? 'gray' : 'white'}
                />
              }
              disabled={!isValidContent}
              loading={sendingPost}
              onClick={
                isValidContent && !sendingPost
                  ? () => handleSubmit(contentPost)
                  : undefined
              }
            >
              Post
            </Button.Medium>
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
