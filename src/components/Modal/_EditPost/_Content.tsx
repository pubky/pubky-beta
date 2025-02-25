import { Button, Icon } from '@social/ui-shared';
import { useEffect, useState } from 'react';
import { useAlertContext, usePubkyClientContext } from '@/contexts';
import { PostView } from '@/types/Post';
import CreateContent from '@/components/CreateContent';

interface CreateEditPostProps {
  setShowModalEditPost: React.Dispatch<React.SetStateAction<boolean>>;
  post: PostView;
  className?: string;
}

export default function ContentEditPost({
  setShowModalEditPost,
  post,
  className,
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
      const editPostUser = await editPost(post.details.id, content);

      if (editPostUser) {
        setContentEditPost('');
        addAlert('Post edited!');
      } else {
        addAlert('Something wrong. Try again', 'warning');
      }
    } catch (error) {
      console.log(error);
      addAlert('Error editing post', 'warning');
    } finally {
      setSendingEditPost(false);
      setShowModalEditPost(false);
    }
  };

  return (
    <div className="flex items-center relative">
      <div className="w-full">
        <CreateContent
          id="new-post-create-content"
          handleSubmit={handleSubmit}
          content={contentEditPost}
          className={className}
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
                  ? () => {
                      handleSubmit(contentEditPost);
                      setShowModalEditPost(false);
                    }
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
