'use client';

import { useEffect, useRef, useState } from 'react';
import { Icon, Button, Post } from '@social/ui-shared';
import Modal from '@/components/Modal';
import { Utils } from '@social/utils-shared';
import Participants from './_Participants';
import Replies from './_Replies';
import CreateContent from '@/components/CreateContent';
import { PostView } from '@/types/Post';
import { useAlertContext, usePubkyClientContext } from '@/contexts';

export default function PostRoot({ post }: { uri: string; post: PostView }) {
  const { pubky, createReply, createTag } = usePubkyClientContext();
  const { addAlert } = useAlertContext();
  const [arrayTags, setArrayTags] = useState<string[]>([]);
  const [showModalTag, setShowModalTag] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isValidContent, setIsValidContent] = useState(false);
  const [textArea, setTextArea] = useState(false);
  const [contentReply, setContentReply] = useState('');
  const [quote, setQuote] = useState<string>();
  const [sendingReply, setSendingReply] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [placeholder, setPlaceholder] = useState('');
  const regex =
    /pubky:\/\/([a-zA-Z0-9]+)\/pub\/pubky\.app\/posts\/([a-zA-Z0-9]+)/;

  useEffect(() => {
    setPlaceholder(Utils.promptPlaceholder('reply'));
  }, []);

  const handleReply = async (content: string) => {
    setSendingReply(true);

    const sendReply = await createReply(
      post?.details?.uri,
      content,
      'short',
      selectedFiles,
      quote,
    );

    const hashtags = Utils.extractHashtags(content);
    const updatedTags = [...new Set([...arrayTags, ...hashtags])];
    const match = sendReply && sendReply.match(regex);

    if (sendReply && match) {
      const replyId = match[2];
      for (const tag of updatedTags) {
        await createTag(pubky ?? '', replyId, tag);
      }
      setSendingReply(false);
      setContentReply('');
      setArrayTags([]);
      setSelectedFiles([]);
      setTextArea(false);
      addAlert('Reply created!');
    }
  };

  if (!pubky) return;

  return (
    <div ref={wrapperRef} className="grid gap-6 xl:grid-cols-3">
      <Post.Root className="col-span-2">
        <CreateContent
          id="reply-create-content"
          handleSubmit={handleReply}
          content={contentReply}
          setContent={setContentReply}
          setTextArea={setTextArea}
          placeHolder={placeholder}
          setQuote={setQuote}
          isValidContent={isValidContent}
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
                  ? () => handleReply(contentReply)
                  : undefined
              }
            >
              Reply
            </Button.Medium>
          }
          textArea={textArea}
        />
        <Replies postId={post.details.id} pubkyAuthor={post.details.author} />
        <Modal.TagCreatePost
          arrayTags={arrayTags}
          setArrayTags={setArrayTags}
          showModalTag={showModalTag}
          setShowModalTag={setShowModalTag}
        />
      </Post.Root>
      <Participants author={post.details.author} />
    </div>
  );
}
