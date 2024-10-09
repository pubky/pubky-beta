import { Button, Icon, Modal } from '@social/ui-shared';
import { useRef, useState } from 'react';
import { useAlertContext, usePubkyClientContext } from '@/contexts';
import { Utils } from '@social/utils-shared';
import Post from '../Post';

import CreateContent from '../CreateContent';
import { PostView } from '@/types/Post';

interface CreateRepostProps {
  showModalRepost: boolean;
  setShowModalRepost: React.Dispatch<React.SetStateAction<boolean>>;
  post: PostView;
  handleRepost: () => Promise<void>;
  modalRepostRef?: React.RefObject<HTMLDivElement>;
}

export default function Repost({
  showModalRepost,
  setShowModalRepost,
  post,
  handleRepost,
}: CreateRepostProps) {
  const { pubky, createRepost, createTag } = usePubkyClientContext();
  const modalRepostRef = useRef<HTMLDivElement>(null);
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

      const newRepost = await createRepost(
        post?.details?.id,
        post?.details?.author,
        content,
        'Short',
        selectedFiles
      );

      if (newRepost) {
        for (const tag of updatedTags) {
          await createTag(pubky ?? '', newRepost, tag);
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
            id="repost-create-content"
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
                id="repost-btn"
                className="w-auto"
                variant="line"
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
                icon={<Icon.Repost color="white" />}
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
