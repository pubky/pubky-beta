import { Button, Icon } from '@social/ui-shared';
import { useEffect, useState } from 'react';
import { useAlertContext, usePubkyClientContext } from '@/contexts';
import { Utils } from '@social/utils-shared';

import { PostView } from '@/types/Post';
import CreateContent from '@/components/CreateContent';
import Post from '@/components/Post';

interface CreateRepostProps {
  setShowModalRepost: React.Dispatch<React.SetStateAction<boolean>>;
  post: PostView;
  setContent?: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
}

export default function ContentCreateRepost({
  setShowModalRepost,
  post,
  setContent,
  className,
}: CreateRepostProps) {
  const { pubky, createRepost, createTag } = usePubkyClientContext();
  const { addAlert } = useAlertContext();
  const [contentRepost, setContentRepost] = useState('');
  const [isValidContent, setIsValidContent] = useState(false);
  const [sendingRepost, setSendingRepost] = useState(false);
  const [arrayTags, setArrayTags] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const regex =
    /pubky:\/\/([a-zA-Z0-9]+)\/pub\/pubky\.app\/posts\/([a-zA-Z0-9]+)/;

  useEffect(() => {
    if (setContent) {
      if (
        contentRepost.trim() !== '' ||
        arrayTags.length !== 0 ||
        selectedFiles.length !== 0
      ) {
        setContent(true);
      } else {
        setContent(false);
      }
    }
  }, [contentRepost, arrayTags, selectedFiles]);

  const handleSubmitRepost = async (content: string) => {
    if (sendingRepost) {
      return;
    }
    try {
      setSendingRepost(true);

      const newRepost = await createRepost(
        post?.details?.id,
        post?.details?.author,
        content,
        'short',
        selectedFiles,
      );

      const hashtags = Utils.extractHashtags(content);
      const updatedTags = [...new Set([...arrayTags, ...hashtags])];
      const match = newRepost && newRepost.match(regex);

      if (newRepost && match) {
        const repostId = match[2];
        for (const tag of updatedTags) {
          await createTag(pubky ?? '', repostId, tag);
        }
        addAlert('Repost created!');
      } else {
        addAlert('Something wrong. Try again', 'warning');
      }
      setArrayTags([]);
      setContentRepost('');
      setShowModalRepost(false);
      setSelectedFiles([]);
    } catch (error) {
      console.log(error);
    } finally {
      setSendingRepost(false);
    }
  };

  const handleSubmitQuickRepost = async () => {
    if (sendingRepost) {
      return;
    }
    try {
      setSendingRepost(true);

      const newRepost = await createRepost(
        post?.details?.id,
        post?.details?.author,
        '',
        'short',
      );

      if (newRepost) {
        addAlert('Repost created!');
      } else {
        addAlert('Something wrong. Try again', 'warning');
      }
      setArrayTags([]);
      setContentRepost('');
      setShowModalRepost(false);
      setSelectedFiles([]);
    } catch (error) {
      console.log(error);
    } finally {
      setSendingRepost(false);
    }
  };

  return (
    <div className="flex items-center relative">
      <div className="w-full">
        <CreateContent
          id="repost-create-content"
          handleSubmit={handleSubmitRepost}
          content={contentRepost}
          className={className}
          setContent={setContentRepost}
          isValidContent={isValidContent}
          setIsValidContent={setIsValidContent}
          selectedFiles={selectedFiles}
          setSelectedFiles={setSelectedFiles}
          loading={sendingRepost}
          arrayTags={arrayTags}
          setArrayTags={setArrayTags}
          placeHolder="Optional comment"
          button={
            <Button.Medium
              id="repost-btn"
              className="w-auto"
              variant="line"
              loading={sendingRepost}
              onClick={
                !sendingRepost
                  ? isValidContent || selectedFiles.length > 0
                    ? () => handleSubmitRepost(contentRepost)
                    : () => handleSubmitQuickRepost()
                  : undefined
              }
              icon={<Icon.Repost color="white" />}
            >
              Repost
            </Button.Medium>
          }
          autoFocus
          visibleTextArea
        >
          <Post
            post={post}
            repostView
            className="mt-2 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-webkit"
            //rounded-bl-none
          />
        </CreateContent>
      </div>
    </div>
  );
}
