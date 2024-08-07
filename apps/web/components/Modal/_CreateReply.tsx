import { Button, Icon, Modal } from '@social/ui-shared';
import { useEffect, useRef, useState } from 'react';

import { useClientContext, useAlertContext } from '@/contexts';
import { IPost } from '@/types';
import { Utils } from '@social/utils-shared';
import Post from '../Post';
import CreateContent from '../CreateContent';

interface CreateReplyProps {
  showModalReply: boolean;
  setShowModalReply: React.Dispatch<React.SetStateAction<boolean>>;
  post: IPost;
}

export default function CreateReply({
  showModalReply,
  setShowModalReply,
  post,
}: CreateReplyProps) {
  const { createReply, createTag } = useClientContext();
  const { setContent, setShow } = useAlertContext();
  const [contentReply, setContentReply] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [arrayTags, setArrayTags] = useState<string[]>([]);
  const modalReplyRef = useRef<HTMLDivElement>(null);
  const [isValidContent, setIsValidContent] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleSubmit = async (content: string) => {
    if (sendingReply) {
      return;
    }
    try {
      setSendingReply(true);

      const hashtags = Utils.extractHashtags(content);
      const updatedTags = [...new Set([...arrayTags, ...hashtags])];
      const rootUri = post.post.root ? post.post.root : post.uri;

      const newReply = await createReply(
        content,
        post.uri,
        rootUri,
        selectedFiles
      );

      if (newReply) {
        for (const tag of updatedTags) {
          await createTag(newReply.uri, tag);
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
      className="w-[792px] max-w-[1200px] max-h-[600px] overflow-y-auto"
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
        className="mt-2 max-h-[600px] overflow-y-auto rounded-bl-none"
      />
      <div className="flex items-center relative">
        <div
          className={`absolute border-l-2 h-full border-neutral-800 after:content-[' * '] after:bg-neutral-800 after:w-[1.5px] after:h-[12px] after:block after:-mt-[12px] after:-ml-[1px]`}
        />
        <div className="absolute ml-[1px] w-3.5 border-t-2 border-neutral-800" />
        <div className="w-full ml-[15px] mt-6">
          <CreateContent
            handleSubmit={handleSubmit}
            content={contentReply}
            setContent={setContentReply}
            isValidContent={isValidContent}
            setIsValidContent={setIsValidContent}
            selectedFiles={selectedFiles}
            setSelectedFiles={setSelectedFiles}
            arrayTags={arrayTags}
            setArrayTags={setArrayTags}
            button={
              <Button.Medium
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
