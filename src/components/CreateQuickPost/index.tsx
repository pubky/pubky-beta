'use client';

import { useEffect, useState } from 'react';
import CreateContent from '../CreateContent';
import { useAlertContext, usePubkyClientContext } from '@/contexts';
import { Button, Icon } from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import { PubkyAppPostKind } from 'pubky-app-specs';

interface CreateQuickPostProps extends React.HTMLAttributes<HTMLDivElement> {
  largeView?: boolean;
  loadingFeed?: boolean;
}

export default function CreateQuickPost({ largeView = false, loadingFeed }: CreateQuickPostProps) {
  const { createPost } = usePubkyClientContext();
  const { addAlert } = useAlertContext();
  const [contentPost, setContentPost] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [sendingPost, setSendingPost] = useState(false);
  const [textArea, setTextArea] = useState(false);
  const [quote, setQuote] = useState<string>();
  const [isValidContent, setIsValidContent] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [arrayTags, setArrayTags] = useState<string[]>([]);
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
        setIsValidContent(false);
        setTextArea(false);
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
    <>
      {!loadingFeed && (
        <CreateContent
          id="quick-post-create-content"
          className="hidden lg:flex"
          largeView={largeView}
          setQuote={setQuote}
          handleSubmit={handleSubmit}
          content={contentPost}
          placeHolder={placeholder}
          setContent={setContentPost}
          setTextArea={setTextArea}
          isValidContent={isValidContent}
          selectedFiles={selectedFiles}
          setSelectedFiles={setSelectedFiles}
          arrayTags={arrayTags}
          setArrayTags={setArrayTags}
          setIsValidContent={setIsValidContent}
          loading={sendingPost}
          textArea={textArea}
          article
          setIsCompressing={setIsCompressing}
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
        />
      )}
    </>
  );
}
