'use client';

import { Button, Icon, Input, Post, Typography } from '@social/ui-shared';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import EmojiPicker, { EmojiStyle, Theme } from 'emoji-picker-react';
import { useClientContext } from '../contexts/client';
import { Utils } from '../utils';
import Image from 'next/image';
import { INewPost } from '../types';
import Modal from './Modal';
import getYouTubeID from 'get-youtube-id';
import { Tweet } from 'react-tweet';

export default function CreateQuickPost() {
  const { pubky, getProfile, createPost, setPosts, createTag } =
    useClientContext();
  const [pic, setPic] = useState('/images/Userpic.png');
  const [name, setName] = useState('Loading...');
  const [handler, setHandler] = useState('');
  const [content, setContent] = useState('');
  const [sendingPost, setSendingPost] = useState(false);
  const [showModalTag, setShowModalTag] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [arrayTags, setArrayTags] = useState<string[]>([]);
  const [textArea, setTextArea] = useState(false);
  const [preview, setPreview] = useState('');
  const [videoId, setVideoId] = useState('');
  const [tweetId, setTweetId] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const wrapperRefEmojis = useRef<HTMLDivElement>(null);

  function checkForLink(text: string) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const url = text.match(urlRegex);
    if (url) {
      setPreview(url[0]);

      const youtubeId = getYouTubeID(text);
      if (youtubeId) {
        setVideoId(youtubeId);
      } else {
        setVideoId('');
      }

      const twitterRegex =
        /^(?:https?:\/\/)?(?:www\.)?(?:twitter\.com|x\.com)\/(?:#!\/)?(\w+)\/status(es)?\/(\d+)$/;
      const twitterMatch = text.match(twitterRegex);
      if (twitterMatch) {
        const tweetId = twitterMatch[3];
        setTweetId(tweetId);
      } else {
        setTweetId('');
      }
    } else {
      setPreview('');
    }
  }

  useEffect(() => {
    checkForLink(content);
  }, [content]);

  async function fetchProfile() {
    try {
      if (!pubky) return;
      const userProfile = await getProfile();

      if (userProfile) {
        setPic(userProfile?.image || '/images/Userpic.png');
        setName(userProfile?.name || 'Loading...');
        setHandler(pubky);
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

      const newPost = await createPost(content);
      if (newPost) {
        for (const tag of arrayTags) {
          await createTag(newPost.uri, tag);
        }
        setPosts((prev: INewPost) => ({
          ...{ [newPost.uri]: newPost },
          ...prev,
        }));
      }
      setArrayTags([]);
      setContent('');
      setPreview('');
      setVideoId('');
      setTweetId('');
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
        setTextArea(false);
        setShowEmojis(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRefEmojis.current &&
        !wrapperRefEmojis.current.contains(event.target as Node)
      ) {
        setTextArea(false);
        setShowEmojis(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRefEmojis]);

  return (
    <div className="p-6 rounded-2xl border-dashed border border-white border-opacity-30 flex-col justify-start items-start inline-flex">
      <Link
        href="/profile"
        className="cursor-pointer justify-start items-center gap-4 flex"
      >
        <Image
          width={32}
          height={32}
          className="w-8 h-8 rounded-full"
          alt="user-image"
          src={pic}
        />
        <Typography.Body
          className={`hover:underline hover:decoration-solid`}
          variant="medium-bold"
        >
          {Utils.minifyText(name, 24)}
        </Typography.Body>
        <Typography.Label className="cursor-pointer text-opacity-30">
          {Utils.minifyPubky(handler)}
        </Typography.Label>
      </Link>
      <div
        ref={wrapperRef}
        className="w-full flex justify-between gap-6 items-start flex-col xl:flex-row"
      >
        <div>
          <Input.CursorArea
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setContent(e.target.value)
            }
            value={content}
            maxLength={280}
            onFocus={() => setTextArea(true)}
            className={`w-full ${
              arrayTags.length > 0 ? 'xl:w-[450px]' : 'xl:w-[650px]'
            } ${textArea ? 'h-auto' : 'h-[25px]'} mt-4`}
            placeholder="What's in your mind?"
          />
          {videoId && (
            <div className="relative border border-stone-800 hover:border-stone-700 mt-4 rounded-xl overflow-hidden">
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
            <Post.LinkPreview url={preview} />
          )}
          {tweetId && (
            <div className="flex overflow-hidden justify-start -mt-2 -mb-6">
              <Tweet id={tweetId} />
            </div>
          )}
          {(textArea || arrayTags.length > 0) && (
            <Post.Actions>
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
                icon={<Icon.ImageSquare size="32" />}
              />
              <Button.Action
                variant="custom"
                icon={<Icon.Smiley size="32" />}
                onClick={(event) => {
                  event.stopPropagation();
                  setShowEmojis(true);
                }}
              />
              {showEmojis && (
                <div
                  className="absolute translate-y-[10%] translate-x-[30%] z-10"
                  ref={wrapperRefEmojis}
                >
                  <EmojiPicker
                    theme={Theme.DARK}
                    emojiStyle={EmojiStyle.TWITTER}
                    onEmojiClick={(emojiObject) => {
                      setContent(content + emojiObject.emoji);
                    }}
                  />
                </div>
              )}
              <Button.Medium
                className="w-[158px]"
                variant="line"
                icon={
                  <Icon.PaperPlaneRight color={!content ? 'gray' : 'white'} />
                }
                disabled={!content}
                loading={sendingPost}
                onClick={
                  content && !sendingPost ? () => handleSubmit() : undefined
                }
              >
                Publish post
              </Button.Medium>
            </Post.Actions>
          )}
        </div>
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
