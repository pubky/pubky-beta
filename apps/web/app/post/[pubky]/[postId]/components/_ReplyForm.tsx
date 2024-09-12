'use client';

import { useRef, useState } from 'react';
import { Icon, Button, Post } from '@social/ui-shared';
import { useClientContext } from '@/contexts';
import Modal from '@/components/Modal';
import { Utils } from '@social/utils-shared';
import { IPost } from '@/types';
import Partecipants from './_Partecipants';
import { IReply } from '@/types';
import Replies from './_Replies';
import CreateContent from '@/components/CreateContent';

export default function ReplyForm({
  uri,
  post,
  updatePost,
  replies,
}: {
  uri: string;
  post: IPost;
  updatePost: () => void;
  replies: IReply;
}) {
  const { createReply, createTag } = useClientContext();
  const [arrayTags, setArrayTags] = useState<string[]>([]);
  const [showModalTag, setShowModalTag] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isValidContent, setIsValidContent] = useState(false);
  const [textArea, setTextArea] = useState(false);
  const [contentReply, setContentReply] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleReply = async (content: string) => {
    setSendingReply(true);
    const rootUri = post.post.root ? post.post.root : uri;
    const sendReply = await createReply(content, uri, rootUri, selectedFiles);

    const hashtags = Utils.extractHashtags(content);
    const updatedTags = [...new Set([...arrayTags, ...hashtags])];

    if (sendReply) {
      for (const tag of updatedTags) {
        await createTag(sendReply.uri, tag);
      }
      setSendingReply(false);
      setContentReply('');
      setArrayTags([]);
      setSelectedFiles([]);
      updatePost();
    }
  };

  return (
    <div ref={wrapperRef} className="grid gap-6 md:grid-cols-3">
      <Post.Root className="col-span-2">
        <CreateContent
          id='reply-create-content'
          handleSubmit={handleReply}
          content={contentReply}
          setContent={setContentReply}
          setTextArea={setTextArea}
          placeHolder="What are your thoughts on this?"
          isValidContent={isValidContent}
          setIsValidContent={setIsValidContent}
          selectedFiles={selectedFiles}
          setSelectedFiles={setSelectedFiles}
          arrayTags={arrayTags}
          setArrayTags={setArrayTags}
          button={
            <Button.Medium
              id='reply-button'
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
                  ? () => handleReply(contentReply)
                  : undefined
              }
            >
              Reply
            </Button.Medium>
          }
          textArea={textArea}
        />
        <Replies repliesResponse={replies} />
        <Modal.TagCreatePost
          arrayTags={arrayTags}
          setArrayTags={setArrayTags}
          showModalTag={showModalTag}
          setShowModalTag={setShowModalTag}
        />
      </Post.Root>
      <Partecipants repliesResponse={replies} />
    </div>
  );
}
