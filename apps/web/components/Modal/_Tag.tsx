'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Icon,
  Button,
  PostUtil,
  Modal,
  Input,
  Typography,
} from '@social/ui-shared';
import { useClientContext } from '../../contexts/client';
import { IPost } from '../../types';
import EmojiPicker, { EmojiStyle, Theme } from 'emoji-picker-react';

interface TagProps extends React.HTMLAttributes<HTMLDivElement> {
  showModalTag: boolean;
  setShowModalTag: React.Dispatch<React.SetStateAction<boolean>>;
  post: IPost;
}

export default function Tag({ showModalTag, setShowModalTag, post }: TagProps) {
  const modalTagRef = useRef<HTMLDivElement>(null);
  const { createTag, posts, setPosts, getPost } = useClientContext();
  const [tag, setTag] = useState('');
  const [arrayTags, setArrayTags] = useState<string[]>([]);
  const [sendingTags, setSendingTags] = useState(false);
  const [tagsError, setTagsError] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const wrapperRefEmojis = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutsideModalTag = (event: MouseEvent) => {
      if (
        modalTagRef.current &&
        !modalTagRef.current.contains(event.target as Node)
      ) {
        setShowModalTag(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutsideModalTag);

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideModalTag);
    };
  }, [modalTagRef, setShowModalTag]);

  const handleSubmit = async () => {
    if (sendingTags) {
      return;
    }
    try {
      setSendingTags(true);
      for (const tag of arrayTags) {
        await createTag(post.uri, tag);
      }

      updatePosts();

      setShowModalTag(false);
      setArrayTags([]);
      setTag('');
    } catch (error) {
      console.log(error);
    } finally {
      setSendingTags(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valueWithoutSpaces = e.target.value.replace(/\s/g, '');
    setTag(valueWithoutSpaces);
  };

  const handleAddTag = () => {
    if (arrayTags.length >= 4) {
      setTagsError(true);
    } else {
      const trimmedTag = tag.trim();
      if (trimmedTag !== '') {
        if (!arrayTags.includes(trimmedTag)) {
          setTag('');
          setArrayTags([...arrayTags, trimmedTag]);
        } else {
          setTag('');
        }
      }
    }
  };

  const updatePosts = async () => {
    const updatedPost = await getPost(post.uri);

    if (!updatedPost) return;

    const updatedPosts = Object.keys(posts).map((key) => {
      if (posts[key].uri === updatedPost.uri) {
        return updatedPost;
      }
      return posts[key];
    });
    setPosts(updatedPosts);
  };

  const handleRemoveTag = async (indexToRemove: number) => {
    setArrayTags(arrayTags.filter((_, index) => index !== indexToRemove));
    if (arrayTags.length <= 4) {
      setTagsError(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddTag();
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

  return (
    <Modal.Root
      modalRef={modalTagRef}
      show={showModalTag}
      closeModal={() => {
        setShowModalTag(false);
        setArrayTags([]);
        setTag('');
        setTagsError(false);
      }}
      className="w-full w-[430px]"
    >
      <Modal.CloseAction
        onClick={() => {
          setShowModalTag(false);
          setArrayTags([]);
          setTag('');
          setTagsError(false);
        }}
      />
      <div className="w-full items-stretch flex-col inline-flex gap-6 -mt-6">
        <Modal.Header title="Tag" />
        <Modal.Content className="flex flex-row w-full">
          <div className="flex-col inline-flex">
            {/**  <div>
              <Typography.Label className="text-opacity-30 font-medium">
                Emotag
              </Typography.Label>
              <div className="mt-2 gap-2 inline-flex">
                <PostUtil.Tag clicked={false} color="red">
                  🔥
                </PostUtil.Tag>
                <PostUtil.Tag clicked={false} color="cyan">
                  👀
                </PostUtil.Tag>
                <PostUtil.Tag clicked={false} color="purple">
                  😂
                </PostUtil.Tag>
                <PostUtil.Tag clicked={false} color="yellow">
                  👍
                </PostUtil.Tag>
                <PostUtil.Tag clicked={false} color="blue">
                  ⭐
                </PostUtil.Tag>
                <PostUtil.Tag clicked={false} color="green">
                  🙏
                </PostUtil.Tag>
                <Button.Action
                  size="small"
                  variant="custom"
                  icon={<Icon.Smiley />}
                />
              </div>
            </div>*/}
            <div>
              {/* <Typography.Label className="text-opacity-30 font-medium">
                {arrayTags.length > 0 ? 'Your Tags' : 'ADD TAGS'}
              </Typography.Label> */}
              <div className="mb-2 justify-start items-start">
                {arrayTags.length > 0 ? (
                  <div className="hidden lg:block justify-start items-start">
                    {arrayTags.map((tag, index) => (
                      <PostUtil.Tag
                        key={index}
                        action={
                          <div onClick={() => handleRemoveTag(index)}>
                            <Icon.X size="20" />
                          </div>
                        }
                        clicked
                        color="fuchsia"
                        className="mr-2 my-1"
                      >
                        {tag}
                      </PostUtil.Tag>
                    ))}
                  </div>
                ) : (
                  <Typography.Body variant="small" className="text-opacity-30">
                    Not tagged yet.
                  </Typography.Body>
                )}
              </div>
            </div>
            <div className="flex flex-row w-full mt-4">
              <Button.Action
                variant="custom"
                icon={<Icon.Smiley size="32" />}
                onClick={(event) => {
                  event.stopPropagation();
                  setShowEmojis(true);
                }}
                className="mr-3 mt-1.5"
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
                      setTag(tag + emojiObject.emoji);
                      setShowEmojis(false);
                    }}
                  />
                </div>
              )}
              <div className="grow"></div>
              {/* <Input.Label value="Add tag" /> */}
              <Input.Text
                placeholder="tag"
                value={tag}
                className="h-[60px] w-full"
                maxLength={20}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                action={
                  <Button.Action
                    icon={<Icon.Plus size="18" />}
                    variant="custom"
                    size="small"
                    onClick={handleAddTag}
                  />
                }
              />
            </div>
            {tagsError && (
              <Typography.Body variant="small" className="text-[#e95164] mt-4">
                Max 4 tags
              </Typography.Body>
            )}
          </div>
        </Modal.Content>
        <Modal.SubmitAction
          icon={<Icon.Check color={arrayTags.length > 0 ? 'white' : 'gray'} />}
          disabled={arrayTags.length === 0}
          onClick={
            arrayTags.length > 0 && !sendingTags ? handleSubmit : undefined
          }
          loading={sendingTags}
        >
          Apply Tags
        </Modal.SubmitAction>
      </div>
    </Modal.Root>
  );
}
