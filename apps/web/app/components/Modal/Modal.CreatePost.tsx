import {
  Button,
  Card,
  Icon,
  Input,
  Modal,
  PostUtil,
  Typography,
} from '@social/ui-shared';
import { useClientContext } from '../../../contexts/client';
import React, { useState } from 'react';

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
  const { createPost, createTag, setRefreshList } = useClientContext();
  const [content, setContent] = useState('');
  const [tag, setTag] = useState('');
  const [arrayTags, setArrayTags] = useState<string[]>([]);

  const handleSubmit = async () => {
    const newPost = await createPost(content);
    for (const tag of arrayTags) {
      await createTag(newPost.value.uri, tag);
    }
    setShowModalPost(false);
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
      modalRef={modalPostRef}
      show={showModalPost}
      closeModal={() => {
        setShowModalPost(false);
        setArrayTags([]);
        setTag('');
      }}
      className="max-w-[1200px]"
    >
      <Modal.CloseAction
        onClick={() => {
          setShowModalPost(false);
          setArrayTags([]);
          setTag('');
        }}
      />
      <Modal.Header title="New Post" />
      <Modal.Content className="inline-flex flex-col mt-6 gap-2 lg:grid lg:grid-cols-3 lg:gap-6">
        <div className="col-span-2">
          <div>
            <Card.Primary
              background="bg-white bg-opacity-10"
              className="scrollbar-thin scrollbar-webkit overflow-x-auto h-[285px] border border-white border-opacity-10 shadow-[0_4px_8px_0_rgba(0,0,0,0.32)_inset] rounded-lg flex flex-col"
            >
              <div className="h-full mb-6">
                <Input.TextArea
                  className="no-scrollbar h-full p-4"
                  placeholder="Write content, drop an image, or paste a link"
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setContent(e.target.value)
                  }
                />
              </div>
              {/**<div className="hidden lg:flex relative">
                  <img
                    className="max-w-full rounded-lg"
                    alt="image"
                    src="/images/user.png"
                  />
                   <Button.Action
                      variant="custom"
                      icon={<Icon.X size="24" />}
                      className='-ml-6 -mt-5'
                    />
                </div>
                <div>
                  <Content.Divider />
                 <div className='flex'>
                  <Typography.H2>
                    Weighing Options of Bitcoin Private Key Management
                  </Typography.H2>
                  <Button.Action
                      variant="custom"
                      icon={<Icon.X size="24" />}
                    />
                    </div>
                  <Typography.Caption className="text-white text-opacity-80">
                    https://bitcoinmagazine.com/
                  </Typography.Caption>
                  <img
                    alt="postImage"
                    src="/images/user.png"
                    className="mt-6 max-w-full rounded-2xl"
                  />
  </div>*/}
            </Card.Primary>
          </div>
          <div className="gap-3 flex mt-9">
            <Button.Action
              variant="image"
              label="Image"
              onClick={() => console.log('button clicked 1')}
              className="hidden lg:flex"
            />

            <Button.Action
              variant="custom"
              icon={<Icon.Clipboard />}
              label="Paste"
              onClick={() => console.log('button clicked 2')}
              className="hidden lg:flex"
            />
            <Button.Action
              variant="link"
              label="Link"
              onClick={() => {
                setShowModalLink(true);
              }}
              className="hidden lg:flex"
            />
          </div>
        </div>
        <div className="flex-col inline-flex justify-between">
          <div className="flex-col justify-start items-start gap-5  inline-flex">
            <Typography.H2 className="hidden lg:block">
              {arrayTags.length > 0 ? 'Your Tags' : 'Add Tags'}
            </Typography.H2>
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
            <div className="hidden lg:flex flex-col w-full items-start">
              <Input.Label value="Add tag:" />
              <Input.Text
                placeholder="#"
                value={tag}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setTag(e.target.value)
                }
                action={
                  <Button.Action
                    variant="custom"
                    icon={<Icon.Plus size="20" />}
                    onClick={handleAddTag}
                  />
                }
              />
            </div>
          </div>
          <div className="w-full">
            <Modal.SubmitAction
              disabled={!content}
              onClick={content ? () => handleSubmit() : undefined}
            >
              Publish Post
            </Modal.SubmitAction>
          </div>
        </div>
      </Modal.Content>
    </Modal.Root>
  );
}
