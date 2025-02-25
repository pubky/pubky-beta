'use client';

import { useEffect, useRef, useState } from 'react';
import { Icon, Button, Post } from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import Participants from './_Participants';
import Replies from './_Replies';
import CreateContent from '@/components/CreateContent';
import { PostView } from '@/types/Post';
import { useAlertContext, usePubkyClientContext } from '@/contexts';
import { parse_uri, PubkyAppPostKind } from 'pubky-app-specs';

export default function PostRoot({ post }: { uri: string; post: PostView }) {
  const { pubky, createReply, createTag } = usePubkyClientContext();
  const { addAlert } = useAlertContext();
  const [arrayTags, setArrayTags] = useState<string[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isValidContent, setIsValidContent] = useState(false);
  const [textArea, setTextArea] = useState(false);
  const [contentReply, setContentReply] = useState('');
  const [quote, setQuote] = useState<string>();
  const [sendingReply, setSendingReply] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [placeholder, setPlaceholder] = useState('');

  useEffect(() => {
    setPlaceholder(Utils.promptPlaceholder('reply'));
  }, []);

  const handleReply = async (content: string) => {
    setSendingReply(true);

    const sendReply = await createReply(
      post?.details?.uri,
      content,
      PubkyAppPostKind.Short,
      selectedFiles,
      quote,
    );

    const hashtags = Utils.extractHashtags(content);
    const updatedTags = [...new Set([...arrayTags, ...hashtags])];

    if (sendReply) {
      const postId = parse_uri(sendReply).resource_id!;
      for (const tag of updatedTags) {
        await createTag(pubky ?? '', postId, tag);
      }
      setSendingReply(false);
      setContentReply('');
      setArrayTags([]);
      setIsValidContent(false);
      setSelectedFiles([]);
      setTextArea(false);
      addAlert(
        <>
          Reply created!{' '}
          <a
            className="text-[#c8ff00] font-bold text-opacity-90 hover:text-opacity-100"
            href={Utils.encodePostUri(sendReply)}
          >
            View
          </a>
        </>,
      );
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
      </Post.Root>
      <Participants author={post.details.author} />
    </div>
  );
}
