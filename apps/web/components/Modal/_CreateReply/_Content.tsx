import { Button, Icon } from '@social/ui-shared';
import { useEffect, useState } from 'react';

import { useAlertContext, usePubkyClientContext } from '@/contexts';
import { Utils } from '@social/utils-shared';
import { PostView } from '@/types/Post';
import Post from '@/components/Post';
import CreateContent from '@/components/CreateContent';

interface CreateReplyProps {
  setShowModalReply: React.Dispatch<React.SetStateAction<boolean>>;
  post: PostView;
}

export default function ContentCreateReply({
  setShowModalReply,
  post,
}: CreateReplyProps) {
  const { pubky, createReply, createTag } = usePubkyClientContext();
  const { addAlert } = useAlertContext();
  const [contentReply, setContentReply] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [arrayTags, setArrayTags] = useState<string[]>([]);
  const [isValidContent, setIsValidContent] = useState(false);
  const [quote, setQuote] = useState<string>();
  const [placeholder, setPlaceholder] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const regex =
    /pubky:\/\/([a-zA-Z0-9]+)\/pub\/pubky\.app\/posts\/([a-zA-Z0-9]+)/;
  const lineHorizontalCSS = (
    <div className="absolute ml-[9px]">
      <Icon.LineHorizontal size="14" color="#262626" />
    </div>
  );

  useEffect(() => {
    setPlaceholder(Utils.promptPlaceholder('reply'));
  }, []);

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
        'short',
        selectedFiles,
        quote,
      );

      const hashtags = Utils.extractHashtags(content);
      const updatedTags = [...new Set([...arrayTags, ...hashtags])];
      const match = newReply && newReply.match(regex);

      if (newReply && match) {
        const replyId = match[2];
        for (const tag of updatedTags) {
          await createTag(pubky ?? '', replyId, tag);
        }
        addAlert('Reply created!');
      } else {
        addAlert('Something wrong. Try again', 'warning');
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

  return (
    <>
      <Post
        post={post}
        repostView
        className="mt-2 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-webkit"
      />
      <div className="flex items-center relative">
        <div
          className={`ml-[9px] absolute border-l-[1px] h-[49%] top-0 border-neutral-800`}
        />
        {lineHorizontalCSS}
        <div className="w-full ml-6 mt-6">
          <CreateContent
            id="create-reply-create-content"
            handleSubmit={handleSubmit}
            content={contentReply}
            setContent={setContentReply}
            isValidContent={isValidContent}
            setQuote={setQuote}
            placeHolder={placeholder}
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
    </>
  );
}
