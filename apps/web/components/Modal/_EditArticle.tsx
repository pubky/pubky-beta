import { Button, Icon, Modal } from '@social/ui-shared';
import CreateContent from '../CreateContent';
import { useEffect, useRef, useState } from 'react';
import { useAlertContext, usePubkyClientContext } from '@/contexts';
import { PostView } from '@/types/Post';

interface CreateEditArticleProps {
  showModalEditArticle: boolean;
  setShowModalEditArticle: React.Dispatch<React.SetStateAction<boolean>>;
  article: PostView;
  modalEditArticleRef: React.RefObject<HTMLDivElement>;
}

export default function EditArticle({
  showModalEditArticle,
  setShowModalEditArticle,
  modalEditArticleRef,
  article,
}: CreateEditArticleProps) {
  const { editPost } = usePubkyClientContext();
  const { setContent, setShow } = useAlertContext();
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
        setContent('Article edited!');
        setShow(true);
      } else {
        setContent('Something went wrong. Try again', 'warning');
        setShow(true);
      }
      setContentEditArticle('');
      setShowModalEditArticle(false);
    } catch (error) {
      console.log(error);
    } finally {
      setSendingEditArticle(false);
    }
  };

  useEffect(() => {
    const handleClickOutsideModals = (event: MouseEvent) => {
      if (
        modalEditArticleRef.current &&
        !modalEditArticleRef.current.contains(event.target as Node)
      ) {
        setShowModalEditArticle(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutsideModals);

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideModals);
    };
  }, [modalEditArticleRef, setShowModalEditArticle]);

  return (
    <Modal.Root
      modalRef={modalEditArticleRef}
      show={showModalEditArticle}
      closeModal={() => {
        setShowModalEditArticle(false);
        //setArrayTags([]);
      }}
      className="md:w-[1200px] max-h-[600px] overflow-y-auto max-w-[1200px]"
    >
      <Modal.CloseAction
        onClick={() => {
          setShowModalEditArticle(false);
          //setArrayTags([]);
          //setContent('');
        }}
      />
      <div className="flex flex-col gap-4">
        <Modal.Header title="Edit Article" />
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
      </div>
    </Modal.Root>
  );
}
