import {
  Button,
  Icon,
  Input,
  Modal,
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
import { Modal as ModalComponent } from '.';
import { Utils } from '@social/utils-shared';
import { IPost } from '@/types';
import Post from '../Post';
import LinkPreviewer from '@/components/LinkPreview';
import { useRouter } from 'next/navigation';

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
  const { pubky, getProfile, createRepost, createTag } = useClientContext();
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

      const newRepost = await createRepost(post.uri, content);
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

  return (
    <Modal.Root
      modalRef={modalRepostRef}
      show={showModalRepost}
      closeModal={() => {
        setShowModalRepost(false);
        setArrayTags([]);
      }}
      className="w-[792px] max-w-[1200px]"
    >
      <Modal.CloseAction
        onClick={() => {
          setShowModalRepost(false);
          setArrayTags([]);
          setContent('');
        }}
      />
      <Modal.Header title="Repost" />
      <div className="p-6 mt-6 rounded-2xl border-dashed border border-white border-opacity-30">
        <Modal.Content className="flex flex-row gap-6 max-h-[300px] overflow-y-auto">
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
              <LinkPreviewer content={contentRepost} />
              <Post
                post={post}
                repostView
                className="p-4 border rounded-lg mt-2"
              />
            </div>
            <ModalComponent.TagCreatePost
              arrayTags={arrayTags}
              setArrayTags={setArrayTags}
              showModalTag={showModalTag}
              setShowModalTag={setShowModalTag}
            />
          </div>
        </Modal.Content>
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
            disabled
            icon={<Icon.ImageSquare color={'gray'} size="32" />}
          />
          <Button.Medium
            className="w-[158px]"
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
    </Modal.Root>
  );
}
