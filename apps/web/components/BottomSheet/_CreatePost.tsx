'use client';

import { BottomSheet, Button, Icon } from '@social/ui-shared';
import React, { useEffect, useState } from 'react';
import CreateContent from '../CreateContent';
import { useAlertContext, usePubkyClientContext } from '@/contexts';
import { Utils } from '@social/utils-shared';

interface CreatePostProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  className?: string;
}

export default function CreatePost({
  show,
  setShow,
  title,
  className,
}: CreatePostProps) {
  const { pubky, createPost, createTag } = usePubkyClientContext();
  const { addAlert } = useAlertContext();
  const [contentPost, setContentPost] = useState('');
  const [sendingPost, setSendingPost] = useState(false);
  const [arrayTags, setArrayTags] = useState<string[]>([]);
  const [isValidContent, setIsValidContent] = useState(false);
  const [quote, setQuote] = useState<string>();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [placeholder, setPlaceholder] = useState('');
  const regex =
    /pubky:\/\/([a-zA-Z0-9]+)\/pub\/pubky\.app\/posts\/([a-zA-Z0-9]+)/;

  useEffect(() => {
    setPlaceholder(Utils.promptPlaceholder('post'));
  }, []);

  const handleSubmit = async (content: string) => {
    if (sendingPost) {
      return;
    }
    try {
      setSendingPost(true);

      const hashtags = Utils.extractHashtags(content);
      const updatedTags = [...new Set([...arrayTags, ...hashtags])];

      const newPost = await createPost(content, 'short', selectedFiles, quote);
      const match = newPost && newPost?.uri.match(regex);

      if (newPost && match) {
        const postId = match[2];
        for (const tag of updatedTags) {
          await createTag(pubky ?? '', postId, tag);
        }

        addAlert('Post created!');
      } else {
        addAlert('Something wrong. Try again', 'warning');
      }
      setArrayTags([]);
      setContentPost('');
      setShow(false);
      setSelectedFiles([]);
    } catch (error) {
      console.log(error);
    } finally {
      setSendingPost(false);
    }
  };

  if (!show) return null;

  return (
    <BottomSheet.Root
      show={show}
      setShow={setShow}
      title={title}
      className={className}
    >
      <div className="w-full">
        <CreateContent
          id="new-post-create-content"
          handleSubmit={handleSubmit}
          content={contentPost}
          setContent={setContentPost}
          placeHolder={placeholder}
          setQuote={setQuote}
          isValidContent={isValidContent}
          setIsValidContent={setIsValidContent}
          selectedFiles={selectedFiles}
          setSelectedFiles={setSelectedFiles}
          loading={sendingPost}
          arrayTags={arrayTags}
          setArrayTags={setArrayTags}
          setShowModalPost={setShow}
          article
          button={
            <Button.Medium
              id="post-btn"
              className="w-auto"
              variant="line"
              icon={
                <Icon.PaperPlaneRight
                  color={
                    !isValidContent && selectedFiles.length === 0
                      ? 'gray'
                      : 'white'
                  }
                />
              }
              disabled={!isValidContent && selectedFiles.length === 0}
              loading={sendingPost}
              onClick={
                (isValidContent || selectedFiles.length > 0) && !sendingPost
                  ? () => handleSubmit(contentPost)
                  : undefined
              }
            >
              Post
            </Button.Medium>
          }
          autoFocus
          visibleTextArea
        />
      </div>
    </BottomSheet.Root>
  );
}
