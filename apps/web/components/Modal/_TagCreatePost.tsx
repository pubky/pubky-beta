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
import EmojiPicker, { EmojiStyle, Theme } from 'emoji-picker-react';
import { Utils } from '@social/utils-shared';

interface TagProps extends React.HTMLAttributes<HTMLDivElement> {
  showModalTag: boolean;
  setShowModalTag: React.Dispatch<React.SetStateAction<boolean>>;
  arrayTags: string[];
  setArrayTags: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function TagCreatePost({
  showModalTag,
  setShowModalTag,
  arrayTags,
  setArrayTags,
}: TagProps) {
  const modalTagRef = useRef<HTMLDivElement>(null);
  const [tag, setTag] = useState('');
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valueWithoutSpaces = e.target.value
      .toLowerCase()
      .replace(/\s/g, '')
      .replace(/!/g, '');
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

  const handleRemoveTag = (indexToRemove: number) => {
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
        setTagsError(false);
      }}
      className="w-full"
    >
      <Modal.CloseAction
        id='close-btn'
        onClick={() => {
          setShowModalTag(false);
          setTagsError(false);
        }}
      />
      <div className="w-full items-stretch flex-col inline-flex gap-6 -mt-6">
        <Modal.Header title="Tag" />
        <Modal.Content className="flex flex-row w-[350px]">
          <div className="w-full flex-col inline-flex">
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
              <div className="mt-2 justify-start items-start">
                {arrayTags.length > 0 ? (
                  <div className="justify-start items-start">
                    {arrayTags.map((tag, index) => (
                      <PostUtil.Tag
                        key={index}
                        action={
                          <div
                            className="flex items-center"
                            onClick={() => handleRemoveTag(index)}
                          >
                            <Icon.X size="16" />
                          </div>
                        }
                        clicked
                        color={tag && Utils.generateRandomColor(tag)}
                        className="mr-2 my-1"
                      >
                        {tag}
                      </PostUtil.Tag>
                    ))}
                  </div>
                ) : (
                  <Typography.Body variant="small" className="text-opacity-30">
                    Not tags yet.
                  </Typography.Body>
                )}
              </div>
            </div>
            <div className="flex flex-row w-full mt-4">
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
              {/* <Input.Label value="Add tag" /> */}
              <Input.Text
                placeholder="tag"
                value={tag}
                maxLength={20}
                onChange={handleChange}
                autoFocus
                onKeyDown={handleKeyDown}
                action={
                  <div className="flex gap-2">
                    <Button.Action
                      id='add-btn'
                      icon={<Icon.Plus size="18" />}
                      variant="custom"
                      size="medium"
                      className={tag ? 'flex' : 'hidden'}
                      onClick={handleAddTag}
                    />
                    <Button.Action
                      id='emoji-btn'
                      variant="custom"
                      icon={<Icon.Smiley size="32" />}
                      size="medium"
                      onClick={(event) => {
                        event.stopPropagation();
                        setShowEmojis(true);
                      }}
                    />
                  </div>
                }
              />
            </div>
            {tagsError && (
              <Typography.Body variant="small" className="text-[#e95164]">
                Max 4 tags
              </Typography.Body>
            )}
          </div>
        </Modal.Content>
        {/**<Modal.SubmitAction
          icon={<Icon.Check color={arrayTags.length > 0 ? 'white' : 'gray'} />}
          disabled={arrayTags.length === 0}
          onClick={() => {
            setShowModalTag(false);
            setTagsError(false);
          }}
        >
          Apply Tags
        </Modal.SubmitAction>*/}
      </div>
    </Modal.Root>
  );
}
