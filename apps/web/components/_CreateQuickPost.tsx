'use client';

import { Button, Icon, Input, Post, PostUtil } from '@social/ui-shared';
import { useEffect, useRef, useState } from 'react';
import EmojiPicker, {
  EmojiClickData,
  EmojiStyle,
  Theme,
} from 'emoji-picker-react';
import { useClientContext } from '../contexts/client';
import Image from 'next/image';
import { INewPost } from '../types';
import Modal from './Modal';
import getYouTubeID from 'get-youtube-id';
import { Tweet } from 'react-tweet';
import { Utils } from '../utils';
import { useAlertContext } from '../contexts/alerts';

export default function CreateQuickPost() {
  const { pubky, getProfile, createPost, setPosts, createTag } =
    useClientContext();
  const { setContent, setShow } = useAlertContext();
  const [pic, setPic] = useState('/images/Userpic.png');
  const [contentPost, setContentPost] = useState('');
  const [sendingPost, setSendingPost] = useState(false);
  const [showModalTag, setShowModalTag] = useState(false);
  const [textArea, setTextArea] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [arrayTags, setArrayTags] = useState<string[]>([]);
  const [preview, setPreview] = useState('');
  const [videoId, setVideoId] = useState('');
  const [tweetId, setTweetId] = useState('');
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const wrapperRef = useRef<HTMLDivElement>(null);
  const wrapperRefEmojis = useRef<HTMLDivElement>(null);
  const [cursorPosition, setCursorPosition] = useState<number>(0);

  const checkForLink = (text: string) => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const timeout = setTimeout(() => {
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const urls = text.match(urlRegex);
      if (urls) {
        const url = urls[0];
        setPreview(url);

        const youtubeId = getYouTubeID(url);
        if (youtubeId) {
          setVideoId(youtubeId);
        } else {
          setVideoId('');
        }

        const twitterRegex =
          /https?:\/\/(?:www\.)?(?:twitter\.com|x\.com)\/(?:#!\/)?(\w+)\/status(es)?\/(\d+)/;
        const twitterMatch = url.match(twitterRegex);
        if (twitterMatch) {
          const tweetId = twitterMatch[3];
          setTweetId(tweetId);
        } else {
          setTweetId('');
        }
      } else {
        setPreview('');
        setVideoId('');
        setTweetId('');
      }
    }, 1000);

    setDebounceTimeout(timeout);
  };

  useEffect(() => {
    checkForLink(contentPost);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentPost]);

  async function fetchProfile() {
    try {
      if (!pubky) return;
      const userProfile = await getProfile();

      if (userProfile) {
        setPic(userProfile?.image || '/images/Userpic.png');
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pubky]);

  const handleSubmit = async () => {
    if (sendingPost) {
      return;
    }
    try {
      setSendingPost(true);

      const newPost = await createPost(contentPost);
      if (newPost) {
        for (const tag of arrayTags) {
          await createTag(newPost.uri, tag);
        }

        const userProfile = await getProfile();

        if (userProfile) {
          newPost.tags = arrayTags.map((tag) => ({
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
      setPreview('');
      setVideoId('');
      setTweetId('');
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

  const handleEmojiClick = (emojiObject: EmojiClickData) => {
    const textBeforeCursor = contentPost.slice(0, cursorPosition);
    const textAfterCursor = contentPost.slice(cursorPosition);
    const newText = textBeforeCursor + emojiObject.emoji + textAfterCursor;
    setContentPost(newText);
    setCursorPosition(cursorPosition + emojiObject.emoji.length);
  };

  return (
    <div className="p-6 mb-4 rounded-2xl border-dashed border border-white border-opacity-30 flex-col justify-start items-start inline-flex">
      <div className="absolute justify-start items-center gap-4 flex">
        <Image
          width={32}
          height={32}
          className="w-8 h-8 rounded-full"
          alt="user-image"
          src={pic}
        />
      </div>
      <div
        ref={wrapperRef}
        className="pl-12 -mt-[10px] w-full flex justify-between gap-6 items-start flex-col"
      >
        <Input.CursorArea
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setContentPost(e.target.value);
            setCursorPosition(e.target.selectionStart);
          }}
          onSelect={(e: React.SyntheticEvent<HTMLTextAreaElement>) => {
            setCursorPosition(e.currentTarget.selectionStart);
          }}
          value={contentPost}
          maxLength={300}
          onClick={() => setTextArea(true)}
          className="w-full h-auto mt-4"
          placeholder="What's in your mind?"
        />
        {videoId && (
          <div className="relative w-full border border-stone-800 hover:border-stone-700 mt-4 rounded-xl overflow-hidden">
            <iframe
              width="100%"
              height="315"
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video player"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        )}
        {preview && !videoId && !tweetId && (
          <div className="flex w-full overflow-hidden justify-start -mt-2 -mb-6">
            <Post.LinkPreview url={preview} />
          </div>
        )}
        {tweetId && (
          <div className="flex w-full overflow-hidden justify-start -mt-2 -mb-6">
            <Tweet id={tweetId} />
          </div>
        )}
        {arrayTags.length > 0 && (
          <div className="inline-flex gap-2 mt-2">
            {arrayTags.map((tag, index) => (
              <PostUtil.Tag
                key={index}
                clicked={false}
                color="fuchsia"
                className="flex flex-col pl-9"
              >
                <Button.Action
                  variant="custom"
                  size="small"
                  className="absolute -left-9 transform -translate-y-[21px] scale-75"
                  icon={<Icon.Minus />}
                  onClick={() =>
                    setArrayTags((prev) => prev.filter((item) => item !== tag))
                  }
                />
                {Utils.minifyText(tag.replace(' ', ''))}
              </PostUtil.Tag>
            ))}
          </div>
        )}
        {(textArea || contentPost || showModalTag || arrayTags.length > 0) && (
          <Post.Actions className="w-full">
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
            <Button.Medium
              className="w-[158px]"
              variant="line"
              icon={
                <Icon.PaperPlaneRight color={!contentPost ? 'gray' : 'white'} />
              }
              disabled={!contentPost}
              loading={sendingPost}
              onClick={
                contentPost && !sendingPost ? () => handleSubmit() : undefined
              }
            >
              Publish post
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
