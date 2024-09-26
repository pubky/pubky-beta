'use client';

import { useState } from 'react';
import CreateContent from '../CreateContent';
import { useAlertContext, usePubkyClientContext } from '@/contexts';
import { Button, Icon } from '@social/ui-shared';

interface CreateQuickPostProps extends React.HTMLAttributes<HTMLDivElement> {
  largeView?: boolean;
}

export default function CreateQuickPost({
  largeView = false,
}: CreateQuickPostProps) {
  // const { getProfile, setPosts, createTag } = useClientContext();
  const { createPost } = usePubkyClientContext();
  const { setContent, setShow } = useAlertContext();
  const [contentPost, setContentPost] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [sendingPost, setSendingPost] = useState(false);
  const [textArea, setTextArea] = useState(false);
  const [isValidContent, setIsValidContent] = useState(false);
  const [arrayTags, setArrayTags] = useState<string[]>([]);

  const handleSubmit = async (content: string) => {
    if (sendingPost) {
      return;
    }
    try {
      setSendingPost(true);

      // const hashtags = Utils.extractHashtags(content);
      // const updatedTags = [...new Set([...arrayTags, ...hashtags])];

      const newPost = await createPost(content, 'Short', selectedFiles);

      if (newPost) {
        // for (const tag of updatedTags) {
        //   await createTag(newPost.uri, tag);
        // }

        // const userProfile = await getProfile();

        // if (userProfile) {
        //   newPost.tags = updatedTags.map((tag) => ({
        //     tag,
        //     count: 1,
        //     from: [
        //       {
        //         id: `${pubky}`,
        //         createdAt: Date.now(),
        //         indexedAt: Date.now(),
        //         author: {
        //           id: `${pubky}`,
        //           uri: `pubky:${pubky}`,
        //           profile: userProfile,
        //         },
        //       },
        //     ],
        //   }));
        // }
        // setPosts((prev: INewPost) => ({
        //   ...{ [newPost.id]: newPost },
        //   ...prev,
        // }));
        setContent('Post created!');
        setShow(true);
      } else {
        setContent('Something wrong. Try again', 'warning');
        setShow(true);
      }
      setArrayTags([]);
      setContentPost('');
      setTextArea(false);
      setSelectedFiles([]);
    } catch (error) {
      console.log(error);
    } finally {
      setSendingPost(false);
    }
  };

  return (
    <CreateContent
      id="quick-post-create-content"
      largeView={largeView}
      handleSubmit={handleSubmit}
      content={contentPost}
      setContent={setContentPost}
      setTextArea={setTextArea}
      isValidContent={isValidContent}
      selectedFiles={selectedFiles}
      setSelectedFiles={setSelectedFiles}
      arrayTags={arrayTags}
      setArrayTags={setArrayTags}
      setIsValidContent={setIsValidContent}
      button={
        <Button.Medium
          id="post-btn"
          className="w-auto"
          variant="line"
          icon={
            <Icon.PaperPlaneRight
              color={
                !isValidContent && selectedFiles.length === 0 ? 'gray' : 'white'
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
      textArea={textArea}
    />
  );
}
