import { Button, Icon } from '@social/ui-shared';

import { useEffect, useState } from 'react';
import { useAlertContext, usePubkyClientContext } from '@/contexts';
import { PostView } from '@/types/Post';
import CreateContent from '@/components/CreateContent';
import { Utils } from '@/components/utils-shared';

interface CreateEditArticleProps {
  setShowModalEditArticle: React.Dispatch<React.SetStateAction<boolean>>;
  article: PostView;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
}

export default function ContentEditArticle({
  setShowModalEditArticle,
  article,
  setShowMenu,
  className
}: CreateEditArticleProps) {
  const { editPost } = usePubkyClientContext();
  const { addAlert } = useAlertContext();
  const [isError, setIsError] = useState(false);
  const [initTitle, setInitTitle] = useState('');
  const [contentEditArticle, setContentEditArticle] = useState('');
  const [sendingEditArticle, setSendingEditArticle] = useState(false);
  const [isValidContent, setIsValidContent] = useState(false);

  useEffect(() => {
    setContentEditArticle(article?.details?.content ? JSON.parse(article?.details?.content).body : '');
    setInitTitle(article?.details?.content ? JSON.parse(article?.details?.content).title : '');
  }, [article]);

  const handleSubmit = async (content: string) => {
    if (sendingEditArticle) {
      return;
    }
    try {
      setSendingEditArticle(true);

      const editArticleUri = await editPost(article.details.id, content);

      if (editArticleUri) {
        addAlert(
          <>
            Article edited!{' '}
            <a
              className="text-[#c8ff00] font-bold text-opacity-90 hover:text-opacity-100"
              href={Utils.encodePostUri(editArticleUri)}
            >
              View
            </a>
          </>
        );
      } else {
        addAlert('Something went wrong. Try again', 'warning');
      }
      setContentEditArticle('');
      setShowModalEditArticle(false);
    } catch (error) {
      console.log(error);
    } finally {
      setSendingEditArticle(false);
      setShowMenu(false);
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
          maxLength={30000}
          className={className}
          setIsValidContent={setIsValidContent}
          loading={sendingEditArticle}
          markdown
          button={
            <Button.Medium
              id="post-btn"
              className="w-auto"
              variant="line"
              icon={<Icon.PencilLine size="16" color={!isValidContent || isError ? 'gray' : 'white'} />}
              disabled={!isValidContent || isError}
              loading={sendingEditArticle}
              onClick={
                isValidContent && !isError
                  ? () =>
                      handleSubmit(
                        JSON.stringify({
                          title: initTitle,
                          body: contentEditArticle
                        })
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
