import { Button, Icon } from '@social/ui-shared';

import { useEffect, useState } from 'react';
import { useAlertContext, usePubkyClientContext } from '@/contexts';
import { Utils } from '@social/utils-shared';
import CreateContent from '@/components/CreateContent';

interface CreatePostProps {
  setShowModalPost: React.Dispatch<React.SetStateAction<boolean>>;
  setContent?: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
}

export default function ContentCreatePost({
  setShowModalPost,
  setContent,
  className,
}: CreatePostProps) {
  const { pubky, createPost, createTag } = usePubkyClientContext();
  const { addAlert } = useAlertContext();
  const [contentPost, setContentPost] = useState('');
  const [sendingPost, setSendingPost] = useState(false);
  const [arrayTags, setArrayTags] = useState<string[]>([]);
  const [isValidContent, setIsValidContent] = useState(false);
  const [quote, setQuote] = useState<string>();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [placeholder, setPlaceholder] = useState('');
  const regex =
    /pubky:\/\/([a-zA-Z0-9]+)\/pub\/pubky\.app\/posts\/([a-zA-Z0-9]+)/;

  useEffect(() => {
    setPlaceholder(Utils.promptPlaceholder('post'));
  }, []);

  useEffect(() => {
    if (setContent) {
      if (
        contentPost.trim() !== '' ||
        arrayTags.length !== 0 ||
        selectedFiles.length !== 0
      ) {
        setContent(true);
      } else {
        setContent(false);
      }
    }
  }, [contentPost, arrayTags, selectedFiles]);

  const handleSubmit = async (content: string) => {
    if (sendingPost) {
      return;
    }
    try {
      setSendingPost(true);

      const hashtags = Utils.extractHashtags(content);
      const updatedTags = [...new Set([...arrayTags, ...hashtags])];

      const newPost = await createPost(content, 'short', selectedFiles, quote);
      const match = newPost && newPost?.uri.match(regex);

      if (newPost && match) {
        const postId = match[2];
        for (const tag of updatedTags) {
          await createTag(pubky ?? '', postId, tag);
        }

        addAlert('Post created!');
      } else {
        addAlert('Something wrong. Try again', 'warning');
      }
      setArrayTags([]);
      setContentPost('');
      setShowModalPost(false);
      setSelectedFiles([]);
    } catch (error) {
      console.log(error);
    } finally {
      setSendingPost(false);
    }
  };
  return (
    <div className="w-full">
      <CreateContent
        id="new-post-create-content"
        className={className}
        handleSubmit={handleSubmit}
        content={contentPost}
        setContent={setContentPost}
        placeHolder={placeholder}
        setQuote={setQuote}
        isValidContent={isValidContent}
        setIsValidContent={setIsValidContent}
        selectedFiles={selectedFiles}
        setSelectedFiles={setSelectedFiles}
        loading={sendingPost}
        arrayTags={arrayTags}
        setArrayTags={setArrayTags}
        setShowModalPost={setShowModalPost}
        article
        button={
          <Button.Medium
            id="post-btn"
            className="w-auto"
            variant="line"
            icon={
              <Icon.PaperPlaneRight
                color={
                  !isValidContent && selectedFiles.length === 0
                    ? 'gray'
                    : 'white'
                }
              />
            }
            disabled={!isValidContent && selectedFiles.length === 0}
            loading={sendingPost}
            onClick={
              (isValidContent || selectedFiles.length > 0) && !sendingPost
                ? () => handleSubmit(contentPost)
                : undefined
            }
          >
            Post
          </Button.Medium>
        }
        autoFocus
        visibleTextArea
      />
    </div>
  );
}
