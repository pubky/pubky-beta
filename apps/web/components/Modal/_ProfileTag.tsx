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

interface ProfileTagProps extends React.HTMLAttributes<HTMLDivElement> {
  showModalProfileTag: boolean;
  setShowModalProfileTag: React.Dispatch<React.SetStateAction<boolean>>;
  arrayTags: string[];
  setArrayTags: React.Dispatch<React.SetStateAction<string[]>>;
  AddTags: () => void;
  loadingAddProfileTags: boolean;
}

export default function ProfileTag({
  showModalProfileTag,
  setShowModalProfileTag,
  arrayTags,
  setArrayTags,
  AddTags,
  loadingAddProfileTags,
}: ProfileTagProps) {
  const modalProfileTagRef = useRef<HTMLDivElement>(null);
  const [tag, setTag] = useState('');
  const [tagsError, setTagsError] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const wrapperRefEmojis = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutsideModalTag = (event: MouseEvent) => {
      if (
        modalProfileTagRef.current &&
        !modalProfileTagRef.current.contains(event.target as Node)
      ) {
        setShowModalProfileTag(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutsideModalTag);

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideModalTag);
    };
  }, [modalProfileTagRef, setShowModalProfileTag]);

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

  const handleSubmitTags = () => {
    setTagsError(false);
    handleAddTag();
    AddTags();
  };

  useEffect(() => {
    if (!loadingAddProfileTags) {
      setShowModalProfileTag(false);
      setArrayTags([]);
    }
  }, [loadingAddProfileTags, setShowModalProfileTag, setArrayTags]);

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
      modalRef={modalProfileTagRef}
      show={showModalProfileTag}
      closeModal={() => {
        setShowModalProfileTag(false);
        setTagsError(false);
      }}
      className="w-full"
    >
      <Modal.CloseAction
        onClick={() => {
          setShowModalProfileTag(false);
          setTagsError(false);
        }}
      />
      <div className="w-full items-stretch flex-col inline-flex gap-6 -mt-6">
        <Modal.Header title="Profile Tag" />
        <Modal.Content className="flex flex-row w-[350px]">
          <div className="flex-col inline-flex">
            <div>
              <div className="mt-2 justify-start items-start">
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
              <Input.Text
                placeholder="tag"
                value={tag}
                className="h-[60px]"
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
              <Typography.Body variant="small" className="text-[#e95164]">
                Max 4 tags
              </Typography.Body>
            )}
          </div>
        </Modal.Content>
        <Modal.SubmitAction
          icon={<Icon.Check color={arrayTags.length > 0 ? 'white' : 'gray'} />}
          disabled={arrayTags.length === 0}
          onClick={handleSubmitTags}
          loading={loadingAddProfileTags}
        >
          Apply Tags
        </Modal.SubmitAction>
      </div>
    </Modal.Root>
  );
}
