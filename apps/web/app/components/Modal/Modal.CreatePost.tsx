import React, { useState } from 'react';
import {
  Button,
  Card,
  Icon,
  Input,
  Modal,
  PostUtil,
  Typography,
} from '@social/ui-shared';
import { z } from 'zod';
import { useClientContext } from '../../../contexts/client';

interface CreatePostProps {
  showModalPost: boolean;
  setShowModalPost: React.Dispatch<React.SetStateAction<boolean>>;
  modalPostRef: React.RefObject<HTMLDivElement>;
  setShowModalLink: React.Dispatch<React.SetStateAction<boolean>>;
}

interface FormErrors {
  [fieldName: string]: string[];
}

const postSchema = z.object({
  content: z.string().max(280, { message: 'Maximum length 280 characters' }),
});

export default function CreatePost({
  showModalPost,
  setShowModalPost,
  modalPostRef,
  setShowModalLink,
}: CreatePostProps) {
  const { createPost, createTag, setRefreshList } = useClientContext();
  const [sendingPost, setSendingPost] = useState(false);
  const [content, setContent] = useState('');
  const [tag, setTag] = useState('');
  const [arrayTags, setArrayTags] = useState<string[]>([]);
  const [tagsError, setTagsError] = useState(false);
  const [errors, setErrors] = useState({
    content: '',
  });

  const handleSubmit = async () => {
    if (sendingPost) {
      return;
    }
    try {
      setSendingPost(true);
      setErrors({
        content: '',
      });
      const result = postSchema.safeParse({
        content,
      });

      if (!result.success) {
        const newErrors: FormErrors = result.error.flatten().fieldErrors;

        const errorMessages = Object.keys(newErrors).reduce(
          (acc: { [key: string]: string }, key) => {
            acc[key] = newErrors[key].join(', ');
            return acc;
          },
          {}
        );

        setErrors((prev) => ({ ...prev, ...errorMessages }));
        return;
      }
      try {
        const newPost = await createPost(content);
        if (newPost) {
          for (const tag of arrayTags) {
            await createTag(newPost.uri, tag);
          }
          setShowModalPost(false);
          setArrayTags([]);
          setTag('');
          setContent('');
          setRefreshList(true);
        }
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSendingPost(false);
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

  const handlePaste = () => {
    navigator.clipboard
      .readText()
      .then((text) => {
        setContent(text);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Modal.Root
      modalRef={modalPostRef}
      show={showModalPost}
      closeModal={() => {
        setShowModalPost(false);
        setArrayTags([]);
        setTag('');
        setTagsError(false);
      }}
      className="max-w-[1200px]"
    >
      <Modal.CloseAction
        onClick={() => {
          setShowModalPost(false);
          setArrayTags([]);
          setTag('');
          setContent('');
          setTagsError(false);
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
              <div className="h-full">
                <Input.TextArea
                  className="no-scrollbar h-[240px]"
                  placeholder="Write content, drop an image, or paste a link"
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setContent(e.target.value)
                  }
                  defaultValue={content}
                  error={errors.content}
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
              onClick={handlePaste}
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
                onChange={handleChange}
                onKeyDown={handleKeyDown}
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
          {tagsError && (
            <Typography.Body variant="small" className="text-[#e95164]">
              Max 4 tags
            </Typography.Body>
          )}
          <div className="w-full mt-6">
            <Modal.SubmitAction
              disabled={!content}
              loading={sendingPost}
              onClick={
                content && !sendingPost ? () => handleSubmit() : undefined
              }
            >
              {!sendingPost ? 'Publish Post' : ''}
            </Modal.SubmitAction>
          </div>
        </div>
      </Modal.Content>
    </Modal.Root>
  );
}
