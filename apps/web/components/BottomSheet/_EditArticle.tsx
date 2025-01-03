'use client';

import { BottomSheet, Button, Icon } from '@social/ui-shared';
import React, { useEffect, useState } from 'react';
import CreateContent from '../CreateContent';
import { useAlertContext, usePubkyClientContext } from '@/contexts';
import { PostView } from '@/types/Post';

interface EditArticleProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  article: PostView;
  title?: string;
  className?: string;
}

export default function EditArticle({
  show,
  setShow,
  article,
  title,
  className,
}: EditArticleProps) {
  const { editPost } = usePubkyClientContext();
  const { addAlert } = useAlertContext();
  const [isError, setIsError] = useState(false);
  const [initTitle, setInitTitle] = useState('');
  const [contentEditArticle, setContentEditArticle] = useState('');
  const [sendingEditArticle, setSendingEditArticle] = useState(false);
  const [isValidContent, setIsValidContent] = useState(false);

  useEffect(() => {
    setContentEditArticle(
      article?.details?.content
        ? JSON.parse(article?.details?.content).body
        : '',
    );
    setInitTitle(
      article?.details?.content
        ? JSON.parse(article?.details?.content).title
        : '',
    );
  }, [article]);

  const handleSubmit = async (content: string) => {
    if (sendingEditArticle) {
      return;
    }
    try {
      setSendingEditArticle(true);

      const editPostUser = await editPost(article, content);

      if (editPostUser) {
        addAlert('Article edited!');
      } else {
        addAlert('Something went wrong. Try again', 'warning');
      }
      setContentEditArticle('');
      setShow(false);
    } catch (error) {
      console.log(error);
    } finally {
      setSendingEditArticle(false);
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
            setIsError={setIsError}
            isError={isError}
            content={contentEditArticle}
            setContent={setContentEditArticle}
            isValidContent={isValidContent}
            maxLength={50000}
            setIsValidContent={setIsValidContent}
            loading={sendingEditArticle}
            markdown
            button={
              <Button.Medium
                id="post-btn"
                className="w-auto"
                variant="line"
                icon={
                  <Icon.PencilLine
                    size="16"
                    color={!isValidContent || isError ? 'gray' : 'white'}
                  />
                }
                disabled={!isValidContent || isError}
                loading={sendingEditArticle}
                onClick={
                  isValidContent && !isError
                    ? () =>
                        handleSubmit(
                          JSON.stringify({
                            title: initTitle,
                            body: contentEditArticle,
                          }),
                        )
                    : undefined
                }
              >
                Edit
              </Button.Medium>
            }
            //autoFocus
            visibleTextArea
          />
        </div>
      </div>
    </BottomSheet.Root>
  );
}
