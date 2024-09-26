import { Button, Icon, Modal } from '@social/ui-shared';
import CreateContent from '../CreateContent';
import { Utils } from '@social/utils-shared';
import { useState } from 'react';
import { useAlertContext, usePubkyClientContext } from '@/contexts';
import { INewPost } from '@/types';

interface CreatePostProps {
  showModalPost: boolean;
  setShowModalPost: React.Dispatch<React.SetStateAction<boolean>>;
  modalPostRef: React.RefObject<HTMLDivElement>;
}

export default function CreatePost({
  showModalPost,
  setShowModalPost,
  modalPostRef,
}: CreatePostProps) {
  const { pubky } = usePubkyClientContext();
  //const { pubky, getProfile, createPost, setPosts, createTag } = useClientContext();
  const { setContent, setShow } = useAlertContext();
  const [contentPost, setContentPost] = useState('');
  const [sendingPost, setSendingPost] = useState(false);
  const [arrayTags, setArrayTags] = useState<string[]>([]);
  const [isValidContent, setIsValidContent] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const handleSubmit = async (content: string) => {
    if (sendingPost) {
      return;
    }
    try {
      setSendingPost(true);

      const hashtags = Utils.extractHashtags(content);
      const updatedTags = [...new Set([...arrayTags, ...hashtags])];

      const newPost = null; //await createPost(content, selectedFiles);

      if (newPost) {
        for (const tag of updatedTags) {
          //await createTag(newPost.uri, tag);
        }

        const userProfile = null; //await getProfile();

        if (userProfile) {
          newPost.tags = updatedTags.map((tag) => ({
            tag,
            count: 1,
            from: [
              {
                id: `${pubky}`,
                createdAt: Date.now(),
                indexedAt: Date.now(),

                author: {
                  id: `${pubky}`,
                  uri: `pubky:${pubky}`,
                  profile: userProfile,
                },
              },
            ],
          }));
        }
        setPosts((prev: INewPost) => ({
          ...{ [newPost.id]: newPost },
          ...prev,
        }));
        setContent('Post created!');
        setShow(true);
      } else {
        setContent('Something wrong. Try again', 'warning');
        setShow(true);
      }
      setArrayTags([]);
      setContentPost('');
      setShowModalPost(false);
      setSelectedFiles([]);
    } catch (error) {
      console.log(error);
    } finally {
      setSendingPost(false);
    }
  };
  return (
    <Modal.Root
      modalRef={modalPostRef}
      show={showModalPost}
      closeModal={() => {
        setShowModalPost(false);
        //setArrayTags([]);
      }}
      className="w-[792px] max-h-[600px] overflow-y-auto max-w-[1200px]"
    >
      <Modal.CloseAction
        onClick={() => {
          setShowModalPost(false);
          //setArrayTags([]);
          //setContent('');
        }}
      />
      <div className="flex flex-col gap-4">
        <Modal.Header title="New Post" />
        <div className="flex items-center relative">
          <div className="w-full">
            <CreateContent
              id="new-post-create-content"
              handleSubmit={handleSubmit}
              content={contentPost}
              setContent={setContentPost}
              isValidContent={isValidContent}
              setIsValidContent={setIsValidContent}
              selectedFiles={selectedFiles}
              setSelectedFiles={setSelectedFiles}
              arrayTags={arrayTags}
              setArrayTags={setArrayTags}
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
        </div>
      </div>
    </Modal.Root>
  );
}
