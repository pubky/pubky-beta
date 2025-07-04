import { Button, Icon } from '@social/ui-shared';
import { useEffect, useState } from 'react';

import { useAlertContext, usePubkyClientContext } from '@/contexts';
import { Utils } from '@social/utils-shared';
import { PostType, PostView } from '@/types/Post';
import Post from '@/components/Post';
import CreateContent from '@/components/CreateContent';
import { parse_uri, PubkyAppPostKind } from 'pubky-app-specs';

interface CreateReplyProps {
  setShowModalReply: React.Dispatch<React.SetStateAction<boolean>>;
  post: PostView;
  setHasContent: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
  postType?: PostType;
}

export default function ContentCreateReply({
  setShowModalReply,
  post,
  setHasContent,
  className,
  postType
}: CreateReplyProps) {
  const { pubky, createReply } = usePubkyClientContext();
  const { addAlert } = useAlertContext();
  const [contentReply, setContentReply] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [arrayTags, setArrayTags] = useState<string[]>([]);
  const [isValidContent, setIsValidContent] = useState(false);
  const [quote, setQuote] = useState<string>();
  const [placeholder, setPlaceholder] = useState('');
  const [isCompressing, setIsCompressing] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const lineHorizontalCSS = (
    <div className="hidden lg:flex absolute ml-[9px]">
      <Icon.LineHorizontal size="14" color="#444447" />
    </div>
  );

  useEffect(() => {
    setHasContent(contentReply.trim().length > 0 || selectedFiles.length > 0 || arrayTags.length > 0);
  }, [contentReply, selectedFiles, arrayTags]);

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

      let postKind = PubkyAppPostKind.Short;
      if (content.includes('http')) {
        postKind = PubkyAppPostKind.Link;
      } else if (selectedFiles.length > 0) {
        const firstFile = selectedFiles[0];
        if (firstFile.type.startsWith('image/')) {
          postKind = PubkyAppPostKind.Image;
        } else if (firstFile.type.startsWith('video/')) {
          postKind = PubkyAppPostKind.Video;
        } else {
          postKind = PubkyAppPostKind.File;
        }
      }

      const hashtags = Utils.extractHashtags(content);
      const filteredHashtags = hashtags.filter((tag) => tag.length <= 20);
      const updatedTags = [...new Set([...arrayTags, ...filteredHashtags])];

      const newReply = await createReply(
        post?.details?.uri,
        content,
        postKind,
        selectedFiles,
        quote,
        updatedTags,
        postType === 'replies'
      );

      if (newReply) {
        addAlert(
          <>
            Reply created!{' '}
            <a className="text-[#c8ff00] font-bold hover:text-opacity-90" href={Utils.encodePostUri(newReply)}>
              View
            </a>
          </>
        );
        setArrayTags([]);
        setContentReply('');
        setShowModalReply(false);
        setSelectedFiles([]);
      } else {
        addAlert('Something wrong. Try again', 'warning');
      }
    } catch (error) {
      console.log(error);
      addAlert('Something wrong. Try again', 'warning');
    } finally {
      setSendingReply(false);
    }
  };

  return (
    <>
      <Post
        post={post}
        replyView
        repostView
        postType="replies"
        className="lg:mt-2 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-webkit"
      />
      <div className="flex items-center relative">
        <div className={`ml-[9px] hidden lg:flex absolute border-l-[1px] h-[49%] top-0 border-[#444447]`} />
        {lineHorizontalCSS}
        <div className="w-full lg:ml-[23px] mt-6">
          <CreateContent
            id="create-reply-create-content"
            handleSubmit={handleSubmit}
            content={contentReply}
            className={className}
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
            setIsCompressing={setIsCompressing}
            button={
              <Button.Medium
                id="reply-btn"
                className="w-auto"
                variant="line"
                icon={
                  <Icon.ChatCircleText
                    color={(!isValidContent && selectedFiles.length === 0) || isCompressing ? 'gray' : 'white'}
                  />
                }
                disabled={(!isValidContent && selectedFiles.length === 0) || sendingReply || isCompressing}
                loading={sendingReply}
                onClick={
                  (isValidContent || selectedFiles.length > 0) && !sendingReply && !isCompressing
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
