import { Button, Icon, Modal } from '@social/ui-shared';
import { useEffect, useRef, useState } from 'react';

import { useAlertContext, usePubkyClientContext } from '@/contexts';
import { Utils } from '@social/utils-shared';
import Post from '../Post';
import CreateContent from '../CreateContent';
import { PostView } from '@/types/Post';

interface CreateReplyProps {
  showModalReply: boolean;
  setShowModalReply: React.Dispatch<React.SetStateAction<boolean>>;
  post: PostView;
}

export default function CreateReply({
  showModalReply,
  setShowModalReply,
  post,
}: CreateReplyProps) {
  const { pubky, createReply, createTag } = usePubkyClientContext();
  const { setContent, setShow } = useAlertContext();
  const [contentReply, setContentReply] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [arrayTags, setArrayTags] = useState<string[]>([]);
  const modalReplyRef = useRef<HTMLDivElement>(null);
  const [isValidContent, setIsValidContent] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const regex =
    /pubky:\/\/([a-zA-Z0-9]+)\/pub\/pubky\.app\/posts\/([a-zA-Z0-9]+)/;
  const lineHorizontalCSS = (
    <div className="absolute ml-[9px]">
      <Icon.LineHorizontal size="14" color="#262626" />
    </div>
  );

  const handleSubmit = async (content: string) => {
    if (sendingReply) {
      return;
    }
    try {
      setSendingReply(true);

      //const rootUri = post.relationships?.replied
      //  ? post.relationships?.replied
      //  : post.details.uri;

      const newReply = await createReply(
        post?.details?.uri,
        content,
        'Short',
        selectedFiles
      );

      const hashtags = Utils.extractHashtags(content);
      const updatedTags = [...new Set([...arrayTags, ...hashtags])];
      const match = newReply && newReply.match(regex);

      if (newReply && match) {
        const replyId = match[2];
        for (const tag of updatedTags) {
          await createTag(pubky ?? '', replyId, tag);
        }
        setContent('Reply created!');
        setShow(true);
      } else {
        setContent('Something wrong. Try again', 'warning');
        setShow(true);
      }
      setArrayTags([]);
      setContentReply('');
      setShowModalReply(false);
      setSelectedFiles([]);
    } catch (error) {
      console.log(error);
    } finally {
      setSendingReply(false);
    }
  };

  useEffect(() => {
    const handleClickOutsideModals = (event: MouseEvent) => {
      if (
        modalReplyRef.current &&
        !modalReplyRef.current.contains(event.target as Node)
      ) {
        setShowModalReply(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutsideModals);

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideModals);
    };
  }, [modalReplyRef, setShowModalReply]);

  return (
    <Modal.Root
      modalRef={modalReplyRef}
      show={showModalReply}
      closeModal={() => {
        setShowModalReply(false);
        setArrayTags([]);
      }}
      className="md:w-[792px] max-w-[1200px] max-h-[600px] overflow-y-auto"
    >
      <Modal.CloseAction
        onClick={() => {
          setShowModalReply(false);
          setArrayTags([]);
          setContent('');
        }}
      />
      <Modal.Header title="Reply" />
      <Post
        post={post}
        repostView
        className="mt-2 max-h-[600px] overflow-y-auto"
      />
      <div className="flex items-center relative">
        <div
          className={`ml-[9px] absolute border-l-2 h-[49%] top-0 border-neutral-800`}
        />
        {lineHorizontalCSS}
        <div className="w-full ml-6 mt-6">
          <CreateContent
            id="create-reply-create-content"
            handleSubmit={handleSubmit}
            content={contentReply}
            setContent={setContentReply}
            isValidContent={isValidContent}
            placeHolder={Utils.promptPlaceholder('reply')}
            setIsValidContent={setIsValidContent}
            selectedFiles={selectedFiles}
            setSelectedFiles={setSelectedFiles}
            loading={sendingReply}
            arrayTags={arrayTags}
            setArrayTags={setArrayTags}
            button={
              <Button.Medium
                id="reply-btn"
                className="w-auto"
                variant="line"
                icon={
                  <Icon.ChatCircleText
                    color={
                      !isValidContent && selectedFiles.length === 0
                        ? 'gray'
                        : 'white'
                    }
                  />
                }
                disabled={!isValidContent && selectedFiles.length === 0}
                loading={sendingReply}
                onClick={
                  (isValidContent || selectedFiles.length > 0) && !sendingReply
                    ? () => handleSubmit(contentReply)
                    : undefined
                }
              >
                Reply
              </Button.Medium>
            }
            autoFocus
            visibleTextArea
          />
        </div>
      </div>
    </Modal.Root>
  );
}
