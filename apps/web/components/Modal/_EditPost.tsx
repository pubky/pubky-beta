import { Button, Icon, Modal } from '@social/ui-shared';
import CreateContent from '../CreateContent';
import { useEffect, useState } from 'react';
import { useAlertContext, usePubkyClientContext } from '@/contexts';
import { PostView } from '@/types/Post';

interface CreateEditPostProps {
  showModalEditPost: boolean;
  setShowModalEditPost: React.Dispatch<React.SetStateAction<boolean>>;
  post: PostView;
  modalEditPostRef: React.RefObject<HTMLDivElement>;
}

export default function EditPost({
  showModalEditPost,
  setShowModalEditPost,
  modalEditPostRef,
  post,
}: CreateEditPostProps) {
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
      setShowModalEditPost(false);
    } catch (error) {
      console.log(error);
    } finally {
      setSendingEditPost(false);
    }
  };

  return (
    <Modal.Root
      modalRef={modalEditPostRef}
      show={showModalEditPost}
      closeModal={() => {
        setShowModalEditPost(false);
        //setArrayTags([]);
      }}
      className="md:w-[792px] max-h-[600px] overflow-y-auto max-w-[1200px]"
    >
      <Modal.CloseAction
        onClick={() => {
          setShowModalEditPost(false);
          //setArrayTags([]);
          //setContent('');
        }}
      />
      <div className="flex flex-col gap-4">
        <Modal.Header title="Edit Post" />
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
              //autoFocus
              visibleTextArea
            />
          </div>
        </div>
      </div>
    </Modal.Root>
  );
}
