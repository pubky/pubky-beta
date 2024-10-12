'use client';

import { useRef, useState } from 'react';
import { Icon, Button, Post } from '@social/ui-shared';
import Modal from '@/components/Modal';
import { Utils } from '@social/utils-shared';
import Partecipants from './_Partecipants';
import Replies from './_Replies';
import CreateContent from '@/components/CreateContent';
import { PostThread, PostView } from '@/types/Post';
import { useAlertContext, usePubkyClientContext } from '@/contexts';

export default function ReplyForm({
  uri,
  post,
  updatePost,
  replies,
  isLoadingReplies,
}: {
  uri: string;
  post: PostView;
  updatePost: () => void;
  replies: PostThread | undefined;
  isLoadingReplies: boolean;
}) {
  const { pubky, createReply, createTag } = usePubkyClientContext();
  const { setContent, setShow } = useAlertContext();
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
    //const rootUri = post.relationships?.replied
    //  ? post.relationships?.replied
    //  : post?.details?.uri;

    const sendReply = await createReply(
      post?.details?.uri,
      content,
      'Short',
      selectedFiles
    );

    const hashtags = Utils.extractHashtags(content);
    const updatedTags = [...new Set([...arrayTags, ...hashtags])];

    if (sendReply) {
      for (const tag of updatedTags) {
        await createTag(pubky ?? '', sendReply, tag);
      }
      setSendingReply(false);
      setContentReply('');
      setArrayTags([]);
      setSelectedFiles([]);
      updatePost();
      setTextArea(false);
      setContent('Reply created!');
      setShow(true);
    }
  };

  return (
    <div ref={wrapperRef} className="grid gap-6 xl:grid-cols-3">
      <Post.Root className="col-span-2">
        <CreateContent
          id="reply-create-content"
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
        <Replies
          post={post}
          repliesResponse={replies}
          isLoadingReplies={isLoadingReplies}
        />
        <Modal.TagCreatePost
          arrayTags={arrayTags}
          setArrayTags={setArrayTags}
          showModalTag={showModalTag}
          setShowModalTag={setShowModalTag}
        />
      </Post.Root>
      <Partecipants author={post.details.author} repliesResponse={replies} />
    </div>
  );
}
