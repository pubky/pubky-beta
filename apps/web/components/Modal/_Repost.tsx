import {
  Button,
  Icon,
  Input,
  Modal,
  Post as PostElement,
  PostUtil,
} from '@social/ui-shared';
import { useEffect, useRef, useState } from 'react';
import EmojiPicker, { EmojiStyle, Theme } from 'emoji-picker-react';
import { useClientContext } from '../../contexts/client';
import Image from 'next/image';
import { Modal as ModalComponent } from '.';
import getYouTubeID from 'get-youtube-id';
import { Tweet } from 'react-tweet';
import { Utils } from '../../utils';
import { IPost } from '../../types';
import Post from '../Post';

interface CreateRepostProps {
  showModalRepost: boolean;
  setShowModalRepost: React.Dispatch<React.SetStateAction<boolean>>;
  modalRepostRef: React.RefObject<HTMLDivElement>;
  post: IPost;
}

export default function Repost({
  showModalRepost,
  setShowModalRepost,
  modalRepostRef,
  post,
}: CreateRepostProps) {
  const { pubky, getProfile, createRepost, createTag } = useClientContext();
  const [pic, setPic] = useState('/images/Userpic.png');
  const [contentRepost, setContentRepost] = useState('');
  const [sendingRepost, setSendingRepost] = useState(false);
  const [showModalTag, setShowModalTag] = useState(false);
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
    checkForLink(contentRepost);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentRepost]);

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

  const handleSubmitRepost = async () => {
    if (sendingRepost) {
      return;
    }
    try {
      setSendingRepost(true);

      const newRepost = await createRepost(post.uri, contentRepost);
      if (newRepost) {
        for (const tag of arrayTags) {
          await createTag(newRepost.uri, tag);
        }
      }
      setArrayTags([]);
      setContentRepost('');
      setPreview('');
      setVideoId('');
      setTweetId('');
      setShowModalRepost(false);
    } catch (error) {
      console.log(error);
    } finally {
      setSendingRepost(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowEmojis(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef, contentRepost]);

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

  return (
    <Modal.Root
      modalRef={modalRepostRef}
      show={showModalRepost}
      closeModal={() => {
        setShowModalRepost(false);
        setArrayTags([]);
      }}
      className="max-w-[1200px]"
    >
      <Modal.Content className="flex flex-row gap-6">
        <div className="rounded-2xl flex-col justify-start items-start inline-flex w-full min-w-[300px] md:min-w-[500px]">
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
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setContentRepost(e.target.value)
              }
              value={contentRepost}
              maxLength={300}
              className={`w-full h-auto mt-4`}
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
                <PostElement.LinkPreview url={preview} />
              </div>
            )}
            {tweetId && (
              <div className="flex w-full overflow-hidden justify-start -mt-2 -mb-6">
                <Tweet id={tweetId} />
              </div>
            )}
            <Post
              post={post}
              repostView
              className="p-4 border rounded-lg mt-2"
            />
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
            <PostElement.Actions className="w-full">
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
                    onEmojiClick={(emojiObject) => {
                      setContentRepost(contentRepost + emojiObject.emoji);
                    }}
                  />
                </div>
              )}
              <div className="grow" />
              <div className="text-opacity-30 text-white text-sm mt-4 mr-2">
                {contentRepost.length} / 300
              </div>
              <Button.Medium
                className="w-[158px]"
                variant="line"
                icon={<Icon.Repost color={!contentRepost ? 'gray' : 'white'} />}
                disabled={!contentRepost}
                loading={sendingRepost}
                onClick={
                  contentRepost && !sendingRepost
                    ? () => handleSubmitRepost()
                    : undefined
                }
              >
                Repost
              </Button.Medium>
            </PostElement.Actions>
          </div>
          <ModalComponent.TagCreatePost
            arrayTags={arrayTags}
            setArrayTags={setArrayTags}
            showModalTag={showModalTag}
            setShowModalTag={setShowModalTag}
          />
        </div>
      </Modal.Content>
    </Modal.Root>
  );
}
