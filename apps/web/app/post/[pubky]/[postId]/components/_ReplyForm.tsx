'use client';

import { useEffect, useRef, useState } from 'react';
import EmojiPicker, {
  EmojiClickData,
  EmojiStyle,
  Theme,
} from 'emoji-picker-react';
import getYouTubeID from 'get-youtube-id';
import { Tweet } from 'react-tweet';
import {
  Icon,
  Button,
  Post,
  Input,
  PostUtil,
  Preview,
} from '@social/ui-shared';
import { useClientContext } from '../../../../../contexts/client';
import Modal from '../../../../../components/Modal';
import { Utils } from '../../../../../utils';
import { IPost } from '../../../../../types';

export default function ReplyForm({
  uri,
  post,
  updatePost,
}: {
  uri: string;
  post: IPost;
  updatePost: () => void;
}) {
  const { getProfile, pubky, createReply, createTag } = useClientContext();
  const [image, setImage] = useState('/images/Userpic.png');
  const [arrayTags, setArrayTags] = useState<string[]>([]);
  const [showModalTag, setShowModalTag] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const wrapperRefEmojis = useRef<HTMLDivElement>(null);
  const [isValidContent, setIsValidContent] = useState(false);
  const [contentReply, setContentReply] = useState('');
  const [preview, setPreview] = useState('');
  const [videoId, setVideoId] = useState('');
  const [tweetId, setTweetId] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [cursorPosition, setCursorPosition] = useState<number>(0);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  const handleReply = async () => {
    setSendingReply(true);
    const rootUri = post.post.root ? post.post.root : uri;
    const sendReply = await createReply(contentReply, uri, rootUri);

    updatePost();
    if (sendReply) {
      for (const tag of arrayTags) {
        await createTag(sendReply.uri, tag);
      }
      setSendingReply(false);
      setContentReply('');
      setPreview('');
      setVideoId('');
      setTweetId('');
      setGithubUrl('');
      setArrayTags([]);
    }
  };

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
        const githubRegex = /https:\/\/github\.com\/[^/]+\/[^/]+/;
        const githubMatch = url.match(githubRegex);
        if (githubMatch) {
          setGithubUrl(githubMatch[0]);
        } else {
          setGithubUrl('');
        }
      } else {
        setPreview('');
        setVideoId('');
        setTweetId('');
        setGithubUrl('');
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

  const handleEmojiClick = (emojiObject: EmojiClickData) => {
    const textBeforeCursor = contentReply.slice(0, cursorPosition);
    const textAfterCursor = contentReply.slice(cursorPosition);
    const newText = textBeforeCursor + emojiObject.emoji + textAfterCursor;
    setContentReply(newText);
    setCursorPosition(cursorPosition + emojiObject.emoji.length);
  };

  return (
    <Post.Root>
      <Post.MainCard className="w-full px-8 py-6 bg-transparent border border-opacity-30 border-dashed rounded-2xl">
        <div className="contents xl:inline-flex gap-12">
          <Post.Header>
            <div className="justify-start gap-4 flex">
              <Post.ImageUser
                className="lg:w-12 lg:h-12 max-w-none h-none mt-2"
                src={image}
                alt="user"
              />
              <Post.Content text="">
                <Input.CursorArea
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                    setContentReply(e.target.value);
                    setCursorPosition(e.target.selectionStart);
                    setIsValidContent(Utils.isValidContent(e.target.value));
                  }}
                  onSelect={(e: React.SyntheticEvent<HTMLTextAreaElement>) => {
                    setCursorPosition(e.currentTarget.selectionStart);
                  }}
                  value={contentReply}
                  maxLength={300}
                  className="h-[25px] max-h-[300px] text-xl w-[250px] md:w-[500px] lg:w-[650px]"
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
                {preview && !videoId && !tweetId && !githubUrl && (
                  <div className="flex w-full overflow-hidden justify-start">
                    <Post.LinkPreview url={preview} />
                  </div>
                )}
                {tweetId && (
                  <div className="flex w-full overflow-hidden justify-start">
                    <Tweet id={tweetId} />
                  </div>
                )}
                {githubUrl && <Preview.GitHub url={githubUrl} />}
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
          <div className="gap-3 inline-flex  mt-6 xl:mt-0">
            <div className="text-opacity-30 text-white text-sm mt-4 mr-2 whitespace-nowrap">
              {contentReply.length} / 300
            </div>
            <Button.Medium
              className="w-[158px]"
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
                  ? () => handleReply()
                  : undefined
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
                    onEmojiClick={handleEmojiClick}
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
