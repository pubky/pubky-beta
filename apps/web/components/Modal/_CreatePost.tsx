import { Button, Icon, Input, Modal, Post, PostUtil } from '@social/ui-shared';
import { useEffect, useRef, useState } from 'react';
import EmojiPicker, {
  EmojiClickData,
  EmojiStyle,
  Theme,
} from 'emoji-picker-react';
import { useClientContext } from '../../contexts/client';
import Image from 'next/image';
import { Modal as ModalComponent } from '.';
import { INewPost } from '../../types';
import { Utils } from '@social/utils-shared';
import { useAlertContext } from '../../contexts/alerts';
import LinkPreviewer from '../_LinkPreviewer';

interface CreatePostProps {
  showModalPost: boolean;
  setShowModalPost: React.Dispatch<React.SetStateAction<boolean>>;
  modalPostRef: React.RefObject<HTMLDivElement>;
  setShowModalLink: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CreatePost({
  showModalPost,
  setShowModalPost,
  modalPostRef,
  setShowModalLink,
}: CreatePostProps) {
  const { pubky, getProfile, createPost, setPosts, createTag } =
    useClientContext();
  const { setContent, setShow } = useAlertContext();
  const [pic, setPic] = useState('/images/Userpic.png');
  const [contentPost, setContentPost] = useState('');
  const [isValidContent, setIsValidContent] = useState(false);
  const [sendingPost, setSendingPost] = useState(false);
  const [showModalTag, setShowModalTag] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [arrayTags, setArrayTags] = useState<string[]>([]);
  const [cursorPosition, setCursorPosition] = useState<number>(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const wrapperRefEmojis = useRef<HTMLDivElement>(null);

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
      setShowModalPost(false);
    } catch (error) {
      console.log(error);
    } finally {
      setSendingPost(false);
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

  const handleEmojiClick = (emojiObject: EmojiClickData) => {
    const textBeforeCursor = contentPost.slice(0, cursorPosition);
    const textAfterCursor = contentPost.slice(cursorPosition);
    const newText = textBeforeCursor + emojiObject.emoji + textAfterCursor;
    setContentPost(newText);
    setCursorPosition(cursorPosition + emojiObject.emoji.length);
  };

  return (
    <Modal.Root
      modalRef={modalPostRef}
      show={showModalPost}
      closeModal={() => {
        setShowModalPost(false);
        setArrayTags([]);
      }}
      className="max-w-[1200px]"
    >
      {/* <Modal.CloseAction
        onClick={() => {
          setShowModalPost(false);
          setArrayTags([]);
          setContent('');
        }}
      /> */}
      {/* <Modal.Header title="New Post" /> */}
      <Modal.Content className="flex flex-row gap-6 max-h-[500px] overflow-y-auto">
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
              autoFocus
              className={`w-full h-auto mt-4`}
              placeholder="What's on your mind?"
            />
            <LinkPreviewer content={contentPost} />
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
          </div>
          <ModalComponent.TagCreatePost
            arrayTags={arrayTags}
            setArrayTags={setArrayTags}
            showModalTag={showModalTag}
            setShowModalTag={setShowModalTag}
          />
        </div>
      </Modal.Content>
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
            <Icon.PaperPlaneRight color={!isValidContent ? 'gray' : 'white'} />
          }
          disabled={!isValidContent}
          loading={sendingPost}
          onClick={
            isValidContent && !sendingPost ? () => handleSubmit() : undefined
          }
        >
          Publish post
        </Button.Medium>
      </Post.Actions>
    </Modal.Root>
  );
}
