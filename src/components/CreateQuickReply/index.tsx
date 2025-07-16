'use client';

import { useEffect, useState } from 'react';
import CreateContent from '../CreateContent';
import { useAlertContext, usePubkyClientContext } from '@/contexts';
import { Button, Icon } from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import { PostView } from '@/types/Post';
import { parse_uri, PubkyAppPostKind } from 'pubky-app-specs';

interface CreateQuickPostProps extends React.HTMLAttributes<HTMLDivElement> {
  post: PostView;
  isNestedReply?: boolean;
}

export default function CreateQuickReply({ post, isNestedReply }: CreateQuickPostProps) {
  const { pubky, createReply, createTag } = usePubkyClientContext();
  const { addAlert } = useAlertContext();
  const [contentReply, setContentReply] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [sendingReply, setSendingReply] = useState(false);
  const [textArea, setTextArea] = useState(false);
  const [quote, setQuote] = useState<string>();
  const [isValidContent, setIsValidContent] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [arrayTags, setArrayTags] = useState<string[]>([]);
  const [placeholder, setPlaceholder] = useState('');

  useEffect(() => {
    setPlaceholder(Utils.promptPlaceholder('reply'));
  }, []);

  const handleReply = async (content: string) => {
    setSendingReply(true);
    // const rootUri = post.relationships?.replied
    //   ? post.relationships?.replied
    //   : post?.details?.uri;

    const sendReply = await createReply(
      post?.details?.uri,
      content,
      PubkyAppPostKind.Short,
      selectedFiles,
      quote,
      arrayTags,
      isNestedReply
    );

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

  return (
    <div className="ml-6">
      <CreateContent
        id="quick-reply-create-content"
        className="p-4"
        handleSubmit={handleReply}
        content={contentReply}
        setContent={setContentReply}
        setTextArea={setTextArea}
        isValidContent={isValidContent}
        setQuote={setQuote}
        selectedFiles={selectedFiles}
        setSelectedFiles={setSelectedFiles}
        placeHolder={placeholder}
        arrayTags={arrayTags}
        setArrayTags={setArrayTags}
        setIsValidContent={setIsValidContent}
        loading={sendingReply}
        styleSearchedUsers="absolute"
        variant="small"
        setIsCompressing={setIsCompressing}
        button={
          <Button.Medium
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
                ? () => handleReply(contentReply)
                : undefined
            }
          >
            Reply
          </Button.Medium>
        }
        textArea={textArea}
      />
    </div>
  );
}
