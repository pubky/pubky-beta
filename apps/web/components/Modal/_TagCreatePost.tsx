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

  return (
    <Modal.Root
      modalRef={modalTagRef}
      show={showModalTag}
      closeModal={() => {
        setShowModalTag(false);
        setTagsError(false);
      }}
      className="w-[480px]"
    >
      <Modal.CloseAction
        onClick={() => {
          setShowModalTag(false);
          setTagsError(false);
        }}
      />
      <div className="items-stretch flex-col inline-flex gap-12">
        <Modal.Header title="Tag" />
        <Modal.Content className="block">
          <div className="flex-col gap-6 inline-flex">
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
              <Typography.Label className="text-opacity-30 font-medium">
                {arrayTags.length > 0 ? 'Your Tags' : 'ADD TAGS'}
              </Typography.Label>
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
                        #{tag}
                      </PostUtil.Tag>
                    ))}
                  </div>
                ) : (
                  <Typography.Body variant="small" className="text-opacity-30">
                    No tags yet
                  </Typography.Body>
                )}
              </div>
            </div>
            <div>
              <Input.Label value="Add tag" />
              <Input.Text
                placeholder="#"
                value={tag}
                className="w-[380px]"
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                action={
                  <Button.Medium
                    icon={<Icon.Plus size="16" />}
                    className="w-[101px]"
                    onClick={handleAddTag}
                  >
                    Add
                  </Button.Medium>
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
          onClick={() => {
            setShowModalTag(false);
            setTagsError(false);
          }}
        >
          Apply Tags
        </Modal.SubmitAction>
      </div>
    </Modal.Root>
  );
}
