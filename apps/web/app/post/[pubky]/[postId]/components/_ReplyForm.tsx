'use client';

import { useEffect, useRef, useState } from 'react';
import EmojiPicker, { EmojiStyle, Theme } from 'emoji-picker-react';
import getYouTubeID from 'get-youtube-id';
import { Tweet } from 'react-tweet';
import { Icon, Button, Post, Input, PostUtil } from '@social/ui-shared';
import { useClientContext } from '../../../../../contexts/client';
import Modal from '../../../../../components/Modal';
import { Utils } from '../../../../../utils';
import { IPost } from '../../../../../types';

export default function ReplyForm({ post }: { post: IPost }) {
  const { getProfile, pubky, createReply, createTag } = useClientContext();
  const [image, setImage] = useState('/images/Userpic.png');
  const [arrayTags, setArrayTags] = useState<string[]>([]);
  const [showModalTag, setShowModalTag] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const wrapperRefEmojis = useRef<HTMLDivElement>(null);
  const [contentReply, setContentReply] = useState('');
  const [preview, setPreview] = useState('');
  const [videoId, setVideoId] = useState('');
  const [tweetId, setTweetId] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  const handleReply = async () => {
    setSendingReply(true);
    const sendReply = await createReply(contentReply, post.uri, post.uri);

    if (sendReply) {
      for (const tag of arrayTags) {
        await createTag(sendReply.uri, tag);
      }
      setSendingReply(false);
      setContentReply('');
      setPreview('');
      setVideoId('');
      setTweetId('');
      setArrayTags([]);
    }
  };

  const checkForLink = (text: string) => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const timeout = setTimeout(() => {
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
    }, 1000);

    setDebounceTimeout(timeout);
  };

  useEffect(() => {
    async function fetchData() {
      const userProfile = await getProfile();
      if (userProfile) {
        setImage(userProfile.image || '/images/Userpic.png');
      }
    }
    fetchData();
  }, [getProfile, pubky]);

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
    checkForLink(contentReply);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentReply]);

  return (
    <Post.Root>
      <Post.MainCard className="w-full px-8 py-6 bg-transparent border border-opacity-30 border-dashed rounded-2xl">
        <div className="contents xl:inline-flex gap-12">
          <Post.Header>
            <div className="justify-start gap-4 flex">
              <Post.ImageUser
                className="lg:w-12 lg:h-12 mt-2"
                src={image}
                alt="user"
              />
              <Post.Content text="">
                <Input.CursorArea
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setContentReply(e.target.value)
                  }
                  value={contentReply}
                  maxLength={300}
                  className="text-2xl w-[250px] md:w-[500px] lg:w-[650px]"
                  placeholder="Post your reply"
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
                  <div className="flex w-full overflow-hidden justify-start">
                    <Post.LinkPreview url={preview} />
                  </div>
                )}
                {tweetId && (
                  <div className="flex w-full overflow-hidden justify-start">
                    <Tweet id={tweetId} />
                  </div>
                )}
                {arrayTags.length > 0 && (
                  <div className="inline-flex gap-2 mt-6">
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
                            setArrayTags((prev) =>
                              prev.filter((item) => item !== tag)
                            )
                          }
                        />
                        {Utils.minifyText(tag.replace(' ', ''))}
                      </PostUtil.Tag>
                    ))}
                  </div>
                )}
              </Post.Content>
            </div>
          </Post.Header>
          <div className="flex gap-3 inline-flex  mt-6 xl:mt-0">
            <div className="text-opacity-30 text-white text-sm mt-4 mr-2 whitespace-nowrap">
              {contentReply.length} / 300
            </div>
            <Button.Medium
              className="w-[158px]"
              variant="line"
              icon={
                <Icon.ChatCircleText color={!contentReply ? 'gray' : 'white'} />
              }
              disabled={!contentReply}
              loading={sendingReply}
              onClick={
                contentReply && !sendingReply ? () => handleReply() : undefined
              }
            >
              Reply
            </Button.Medium>
            <Post.Footer>
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
                disabled
                icon={<Icon.ImageSquare color={'gray'} size="22" />}
              />
              {showEmojis && (
                <div
                  className="absolute translate-y-[-100%] translate-x-[-70%] z-10"
                  ref={wrapperRefEmojis}
                >
                  <EmojiPicker
                    theme={Theme.DARK}
                    emojiStyle={EmojiStyle.TWITTER}
                    onEmojiClick={(emojiObject) => {
                      setContentReply(contentReply + emojiObject.emoji);
                    }}
                  />
                </div>
              )}
            </Post.Footer>
          </div>
        </div>
      </Post.MainCard>
      <Modal.TagCreatePost
        arrayTags={arrayTags}
        setArrayTags={setArrayTags}
        showModalTag={showModalTag}
        setShowModalTag={setShowModalTag}
      />
    </Post.Root>
  );
}
