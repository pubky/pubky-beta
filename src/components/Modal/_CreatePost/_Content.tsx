import { Button, Icon } from '@social/ui-shared';

import { useEffect, useState } from 'react';
import { useAlertContext, usePubkyClientContext } from '@/contexts';
import { Utils } from '@social/utils-shared';
import CreateContent from '@/components/CreateContent';
import { PubkyAppPostKind } from 'pubky-app-specs';

interface CreatePostProps {
  setShowModalPost: React.Dispatch<React.SetStateAction<boolean>>;
  setHasContent: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
}

export default function ContentCreatePost({ setShowModalPost, setHasContent, className }: CreatePostProps) {
  const { createPost } = usePubkyClientContext();
  const { addAlert } = useAlertContext();
  const [contentPost, setContentPost] = useState('');
  const [sendingPost, setSendingPost] = useState(false);
  const [arrayTags, setArrayTags] = useState<string[]>([]);
  const [isValidContent, setIsValidContent] = useState(false);
  const [quote, setQuote] = useState<string>();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [placeholder, setPlaceholder] = useState('');

  useEffect(() => {
    setHasContent(contentPost.trim().length > 0 || selectedFiles.length > 0 || arrayTags.length > 0);
  }, [contentPost, selectedFiles, arrayTags]);

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
      const filteredHashtags = hashtags.filter((tag) => tag.length <= 20);
      const updatedTags = [...new Set([...arrayTags, ...filteredHashtags])];

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
            <a className="text-[#c8ff00] font-bold hover:text-opacity-90" href={Utils.encodePostUri(newPost?.uri)}>
              View
            </a>
          </>
        );
        setArrayTags([]);
        setContentPost('');
        setShowModalPost(false);
        setSelectedFiles([]);
      } else {
        addAlert('Something wrong. Try again', 'warning');
      }
    } catch (error) {
      console.log(error);
      addAlert('Something wrong. Try again', 'warning');
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
        setIsCompressing={setIsCompressing}
        article
        button={
          <Button.Medium
            id="post-btn"
            className="w-auto"
            variant="line"
            icon={
              <Icon.PaperPlaneRight
                color={(!isValidContent && selectedFiles.length === 0) || isCompressing ? 'gray' : 'white'}
              />
            }
            disabled={(!isValidContent && selectedFiles.length === 0) || sendingPost || isCompressing}
            loading={sendingPost}
            onClick={
              (isValidContent || selectedFiles.length > 0) && !sendingPost && !isCompressing
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
