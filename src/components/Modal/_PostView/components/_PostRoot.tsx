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
  const { pubky, createReply, createTag, replies } = usePubkyClientContext();
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

  // Reset component state when post changes
  useEffect(() => {
    setArrayTags([]);
    setIsValidContent(false);
    setTextArea(false);
    setContentReply('');
    setQuote(undefined);
    setSendingReply(false);
    setSelectedFiles([]);
  }, [post?.details?.id]);

  const handleReply = async (content: string) => {
    setSendingReply(true);

    const sendReply = await createReply(post?.details?.uri, content, PubkyAppPostKind.Short, selectedFiles, quote);

    const hashtags = Utils.extractHashtags(content);
    const filteredHashtags = hashtags.filter((tag) => tag.length <= 20);
    const updatedTags = [...new Set([...arrayTags, ...filteredHashtags])];

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
          <a className="text-[#c8ff00] font-bold hover:text-opacity-90" href={Utils.encodePostUri(sendReply)}>
            View
          </a>
        </>
      );
    }
  };

  if (!pubky) return;

  return (
    <div className="flex items-center relative">
      <div ref={wrapperRef} className="w-full grid gap-6 xl:grid-cols-3">
        <Post.Root className="col-span-2">
          <div className="flex items-center relative">
            <div
              className={`${replies.length > 0 ? 'h-full' : 'h-[47%]'} ml-[10px] absolute border-l-[1px] top-0 border-[#444447] after:content-[' * '] after:bg-[#444447] after:w-[1px] after:h-[26px] after:block after:-mt-[24px] after:-ml-[0.8px]`}
            />
            <div className="absolute ml-[10px]">
              <Icon.LineHorizontal size="14" color="#444447" />
            </div>
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
                    <Icon.ChatCircleText color={!isValidContent && selectedFiles.length === 0 ? 'gray' : 'white'} />
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
              className="mb-3 ml-6"
            />
          </div>
          <Replies postId={post?.details?.id} pubkyAuthor={post?.details?.author} />
        </Post.Root>
        <Participants author={post?.details?.author} />
      </div>
    </div>
  );
}
