import { Button, Icon } from '@social/ui-shared';

import { useEffect, useState } from 'react';
import { useAlertContext, usePubkyClientContext } from '@/contexts';
import { PostView } from '@/types/Post';
import CreateContent from '@/components/CreateContent';

interface CreateEditArticleProps {
  setShowModalEditArticle: React.Dispatch<React.SetStateAction<boolean>>;
  article: PostView;
  className?: string;
  setContent?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ContentEditArticle({
  setShowModalEditArticle,
  article,
  className,
  setContent,
}: CreateEditArticleProps) {
  const { editPost } = usePubkyClientContext();
  const { addAlert } = useAlertContext();
  const [isError, setIsError] = useState(false);
  const [initTitle, setInitTitle] = useState('');
  const [contentEditArticle, setContentEditArticle] = useState('');
  const [sendingEditArticle, setSendingEditArticle] = useState(false);
  const [isValidContent, setIsValidContent] = useState(false);

  useEffect(() => {
    if (setContent) {
      if (contentEditArticle.trim() !== '') {
        setContent(true);
      } else {
        setContent(false);
      }
    }
  }, [contentEditArticle]);

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
      setShowModalEditArticle(false);
    } catch (error) {
      console.log(error);
    } finally {
      setSendingEditArticle(false);
    }
  };

  return (
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
          className={className}
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
  );
}
