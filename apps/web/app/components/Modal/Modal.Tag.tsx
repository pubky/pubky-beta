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
import { useClientContext } from '../../../contexts/client';
import { IPost } from '../../../types';

type SetRefreshListType = (value: boolean) => void;

interface TagProps extends React.HTMLAttributes<HTMLDivElement> {
  showModalTag: boolean;
  setShowModalTag: React.Dispatch<React.SetStateAction<boolean>>;
  post: IPost;
  setRefreshList: SetRefreshListType;
}

export default function Tag({
  showModalTag,
  setShowModalTag,
  post,
  setRefreshList,
}: TagProps) {
  const modalTagRef = useRef<HTMLDivElement>(null);
  const { createTag } = useClientContext();
  const [tag, setTag] = useState('');
  const [arrayTags, setArrayTags] = useState<string[]>([]);

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
    for (const tag of arrayTags) {
      await createTag(post.uri, tag);
    }
    setShowModalTag(false);
    setArrayTags([]);
    setTag('');
    setRefreshList(true);
  };

  const handleAddTag = () => {
    if (tag.trim() !== '') {
      setTag('');
      setArrayTags([...arrayTags, tag.trim()]);
    }
  };

  const handleRemoveTag = (indexToRemove: number) => {
    setArrayTags(arrayTags.filter((_, index) => index !== indexToRemove));
  };

  return (
    <Modal.Root
      modalRef={modalTagRef}
      show={showModalTag}
      closeModal={() => {
        setShowModalTag(false);
        setArrayTags([]);
        setTag('');
      }}
      className="w-[480px]"
    >
      <Modal.CloseAction
        onClick={() => {
          setShowModalTag(false);
          setArrayTags([]);
          setTag('');
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
                        color="amber"
                        className="mr-2 my-1"
                      >
                        # {tag}
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setTag(e.target.value)
                }
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
          </div>
        </Modal.Content>
        <Modal.SubmitAction
          icon={<Icon.Check color={arrayTags.length > 0 ? 'white' : 'gray'} />}
          disabled={arrayTags.length === 0}
          onClick={arrayTags.length > 0 ? handleSubmit : undefined}
        >
          Apply Tags
        </Modal.SubmitAction>
      </div>
    </Modal.Root>
  );
}
