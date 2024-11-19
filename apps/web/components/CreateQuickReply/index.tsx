'use client';

import { useEffect, useState } from 'react';
import CreateContent from '../CreateContent';
import { useAlertContext, usePubkyClientContext } from '@/contexts';
import { Button, Icon } from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import { PostView } from '@/types/Post';

interface CreateQuickPostProps extends React.HTMLAttributes<HTMLDivElement> {
  post: PostView;
}

export default function CreateQuickReply({ post }: CreateQuickPostProps) {
  const { pubky, createReply, createTag } = usePubkyClientContext();
  const { setContent, setShow } = useAlertContext();
  const [contentReply, setContentReply] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [sendingReply, setSendingReply] = useState(false);
  const [textArea, setTextArea] = useState(false);
  const [isValidContent, setIsValidContent] = useState(false);
  const [arrayTags, setArrayTags] = useState<string[]>([]);
  const [placeholder, setPlaceholder] = useState('');
  const regex =
    /pubky:\/\/([a-zA-Z0-9]+)\/pub\/pubky\.app\/posts\/([a-zA-Z0-9]+)/;

  useEffect(() => {
    setPlaceholder(Utils.promptPlaceholder('reply'));
  }, []);

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
      setContent('Reply created!');
      setShow(true);
    }
  };

  return (
    <div className="ml-6">
      <CreateContent
        id="quick-post-create-content"
        className="p-4"
        handleSubmit={handleReply}
        content={contentReply}
        setContent={setContentReply}
        setTextArea={setTextArea}
        isValidContent={isValidContent}
        selectedFiles={selectedFiles}
        setSelectedFiles={setSelectedFiles}
        placeHolder={placeholder}
        arrayTags={arrayTags}
        setArrayTags={setArrayTags}
        setIsValidContent={setIsValidContent}
        loading={sendingReply}
        variant="small"
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
