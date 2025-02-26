import { Button, Icon } from '@social/ui-shared';

import { useEffect, useState } from 'react';
import { useAlertContext, usePubkyClientContext } from '@/contexts';
import { Utils } from '@social/utils-shared';
import CreateContent from '@/components/CreateContent';
import { PubkyAppPostKind } from 'pubky-app-specs';

interface CreatePostProps {
  setShowModalPost: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
}

export default function ContentCreatePost({ setShowModalPost, className }: CreatePostProps) {
  const { createPost } = usePubkyClientContext();
  const { addAlert } = useAlertContext();
  const [contentPost, setContentPost] = useState('');
  const [sendingPost, setSendingPost] = useState(false);
  const [arrayTags, setArrayTags] = useState<string[]>([]);
  const [isValidContent, setIsValidContent] = useState(false);
  const [quote, setQuote] = useState<string>();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [placeholder, setPlaceholder] = useState('');

  useEffect(() => {
    setPlaceholder(Utils.promptPlaceholder('post'));
  }, []);

  const handleSubmit = async (content: string) => {
    if (sendingPost) {
      return;
    }
    try {
      setSendingPost(true);

      const hashtags = Utils.extractHashtags(content);
      const updatedTags = [...new Set([...arrayTags, ...hashtags])];

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

      const newPost = await createPost(content, postKind, selectedFiles, quote, updatedTags);

      if (newPost) {
        addAlert(
          <>
            Post created!{' '}
            <a
              className="text-[#c8ff00] font-bold text-opacity-90 hover:text-opacity-100"
              href={Utils.encodePostUri(newPost?.uri)}
            >
              View
            </a>
          </>
        );
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
            icon={<Icon.PaperPlaneRight color={!isValidContent && selectedFiles.length === 0 ? 'gray' : 'white'} />}
            disabled={!isValidContent && selectedFiles.length === 0}
            loading={sendingPost}
            onClick={
              (isValidContent || selectedFiles.length > 0) && !sendingPost ? () => handleSubmit(contentPost) : undefined
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
