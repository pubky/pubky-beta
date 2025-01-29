'use client';

import { useEffect, useState } from 'react';
import CreateContent from '../CreateContent';
import { useAlertContext, usePubkyClientContext } from '@/contexts';
import { Button, Icon } from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import { PostView } from '@/types/Post';
import { PubkyAppPostKind } from 'pubky-app-specs';

interface CreateQuickPostProps extends React.HTMLAttributes<HTMLDivElement> {
  largeView?: boolean;
  loadingFeed?: boolean;
}

export default function CreateQuickPost({
  largeView = false,
  loadingFeed,
}: CreateQuickPostProps) {
  const { pubky, createPost, createTag, setTimeline } = usePubkyClientContext();
  const { addAlert } = useAlertContext();
  const [contentPost, setContentPost] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [sendingPost, setSendingPost] = useState(false);
  const [textArea, setTextArea] = useState(false);
  const [quote, setQuote] = useState<string>();
  const [isValidContent, setIsValidContent] = useState(false);
  const [arrayTags, setArrayTags] = useState<string[]>([]);
  const [placeholder, setPlaceholder] = useState('');
  const regex =
    /pubky:\/\/([a-zA-Z0-9]+)\/pub\/pubky\.app\/posts\/([a-zA-Z0-9]+)/;

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

      const newPost = await createPost(
        content,
        PubkyAppPostKind.Short,
        selectedFiles,
        quote,
      );
      const match = newPost && newPost?.uri.match(regex);

      if (newPost && match) {
        const postId = match[2];
        for (const tag of updatedTags) {
          await createTag(pubky ?? '', postId, tag);
        }

        const postWithFullDetails: PostView = {
          details: {
            content: newPost.details.content || '',
            id: postId,
            indexed_at: Date.now(),
            author: pubky ?? '',
            kind: newPost.details.kind || PubkyAppPostKind.Short,
            uri: newPost.uri || '',
          },
          counts: {
            tags: 0,
            replies: 0,
            reposts: 0,
          },
          tags: updatedTags.map((tag) => ({
            name: tag,
            label: tag,
            taggers: [],
            taggers_count: 0,
          })),
          relationships: {
            replied: undefined,
            reposted: undefined,
            mentioned: [],
          },
          bookmark: undefined,
          cached: 'local',
        };

        setTimeline((prevTimeline) => [...prevTimeline, postWithFullDetails]);
        addAlert('Post created!');
      } else {
        addAlert('Something wrong. Try again', 'warning');
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
              disabled={
                (!isValidContent && selectedFiles.length === 0) || sendingPost
              }
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
      )}
    </>
  );
}
