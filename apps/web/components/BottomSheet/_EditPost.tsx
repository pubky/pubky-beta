'use client';

import { BottomSheet, Button, Icon } from '@social/ui-shared';
import React, { useEffect, useState } from 'react';
import CreateContent from '../CreateContent';
import { useAlertContext, usePubkyClientContext } from '@/contexts';
import { PostView } from '@/types/Post';

interface EditPostProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  post: PostView;
  title?: string;
  className?: string;
}

export default function EditPost({
  show,
  setShow,
  post,
  title,
  className,
}: EditPostProps) {
  const { editPost } = usePubkyClientContext();
  const { addAlert } = useAlertContext();
  const [contentEditPost, setContentEditPost] = useState('');
  const [sendingEditPost, setSendingEditPost] = useState(false);
  const [isValidContent, setIsValidContent] = useState(false);

  useEffect(() => {
    setContentEditPost(post?.details?.content);
  }, [post]);

  const handleSubmit = async (content: string) => {
    if (sendingEditPost) {
      return;
    }
    try {
      setSendingEditPost(true);

      const editPostUser = await editPost(post, content);

      if (editPostUser) {
        addAlert('Post edited!');
      } else {
        addAlert('Something wrong. Try again', 'warning');
      }
      setContentEditPost('');
      setShow(false);
    } catch (error) {
      console.log(error);
    } finally {
      setSendingEditPost(false);
    }
  };

  return (
    <BottomSheet.Root
      show={show}
      setShow={setShow}
      title={title}
      className={className}
    >
      <div className="flex items-center relative">
        <div className="w-full">
          <CreateContent
            id="new-post-create-content"
            handleSubmit={handleSubmit}
            content={contentEditPost}
            placeHolder="Edit post"
            setContent={setContentEditPost}
            isValidContent={isValidContent}
            setIsValidContent={setIsValidContent}
            loading={sendingEditPost}
            button={
              <Button.Medium
                id="post-btn"
                className="w-auto"
                variant="line"
                icon={
                  <Icon.PaperPlaneRight
                    color={!isValidContent ? 'gray' : 'white'}
                  />
                }
                disabled={!isValidContent}
                loading={sendingEditPost}
                onClick={
                  isValidContent
                    ? () => handleSubmit(contentEditPost)
                    : undefined
                }
              >
                Edit
              </Button.Medium>
            }
            autoFocus
            visibleTextArea
          />
        </div>
      </div>
    </BottomSheet.Root>
  );
}
