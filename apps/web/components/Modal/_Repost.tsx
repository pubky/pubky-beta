import { Button, Icon, Modal } from '@social/ui-shared';
import { useState } from 'react';
import { useClientContext, useAlertContext } from '@/contexts';
import { Utils } from '@social/utils-shared';
import { IPost } from '@/types';
import Post from '../Post';

import CreateContent from '../CreateContent';

interface CreateRepostProps {
  showModalRepost: boolean;
  setShowModalRepost: React.Dispatch<React.SetStateAction<boolean>>;
  modalRepostRef: React.RefObject<HTMLDivElement>;
  post: IPost;
  handleRepost: () => Promise<void>;
}

export default function Repost({
  showModalRepost,
  setShowModalRepost,
  modalRepostRef,
  post,
  handleRepost,
}: CreateRepostProps) {
  const { createRepost, createTag } = useClientContext();
  const { setContent, setShow } = useAlertContext();
  const [contentRepost, setContentRepost] = useState('');
  const [isValidContent, setIsValidContent] = useState(false);
  const [sendingRepost, setSendingRepost] = useState(false);

  const [arrayTags, setArrayTags] = useState<string[]>([]);

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleSubmitRepost = async (content: string) => {
    if (sendingRepost) {
      return;
    }
    try {
      setSendingRepost(true);
      const hashtags = Utils.extractHashtags(content);
      const updatedTags = [...new Set([...arrayTags, ...hashtags])];

      const newRepost = await createRepost(post.uri, content, selectedFiles);

      if (newRepost) {
        for (const tag of updatedTags) {
          await createTag(newRepost.uri, tag);
        }
        setContent('Repost created!');
        setShow(true);
      } else {
        setContent('Something wrong. Try again', 'warning');
        setShow(true);
      }
      setArrayTags([]);
      setContentRepost('');
      setShowModalRepost(false);
      setSelectedFiles([]);
    } catch (error) {
      console.log(error);
    } finally {
      setSendingRepost(false);
    }
  };

  return (
    <Modal.Root
      modalRef={modalRepostRef}
      show={showModalRepost}
      closeModal={() => {
        setShowModalRepost(false);
        setArrayTags([]);
      }}
      className="w-[792px] max-w-[1200px] max-h-[600px] overflow-y-auto"
    >
      <Modal.CloseAction
        onClick={() => {
          setShowModalRepost(false);
          setArrayTags([]);
          setContent('');
        }}
      />
      <Modal.Header title="Repost" />
      <div className="flex items-center relative">
        <div className="w-full mt-6">
          <CreateContent
            handleSubmit={handleSubmitRepost}
            content={contentRepost}
            setContent={setContentRepost}
            isValidContent={isValidContent}
            setIsValidContent={setIsValidContent}
            selectedFiles={selectedFiles}
            setSelectedFiles={setSelectedFiles}
            arrayTags={arrayTags}
            setArrayTags={setArrayTags}
            placeHolder="Optional comment"
            button={
              <Button.Medium
                className="w-auto"
                variant="line"
                icon={<Icon.Repost color="white" />}
                loading={sendingRepost}
                onClick={
                  !sendingRepost
                    ? isValidContent || selectedFiles.length > 0
                      ? () => handleSubmitRepost(contentRepost)
                      : () => {
                          setSendingRepost(true);
                          handleRepost();
                          setShowModalRepost(false);
                          setSendingRepost(false);
                        }
                    : undefined
                }
                //icon={<Icon.Repost color={!isValidContent ? 'gray' : 'white'} />}
                //disabled={!isValidContent}
                //onClick={
                //  isValidContent && !sendingRepost
                //</PostElement.Actions>    ? () => handleSubmitRepost()
                //    : undefined
                // }
              >
                Repost
              </Button.Medium>
            }
            autoFocus
            visibleTextArea
          >
            <Post
              post={post}
              repostView
              className="mt-2 max-h-[600px] overflow-y-auto"
              //rounded-bl-none
            />
          </CreateContent>
        </div>
      </div>
    </Modal.Root>
  );
}
