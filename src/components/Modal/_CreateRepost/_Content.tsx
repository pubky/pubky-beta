import { Button, Icon } from '@social/ui-shared';
import { useEffect, useState } from 'react';
import { useAlertContext, usePubkyClientContext } from '@/contexts';
import { Utils } from '@social/utils-shared';

import { PostView } from '@/types/Post';
import CreateContent from '@/components/CreateContent';
import Post from '@/components/Post';
import { parse_uri, PubkyAppPostKind } from 'pubky-app-specs';

interface CreateRepostProps {
  setShowModalRepost: React.Dispatch<React.SetStateAction<boolean>>;
  post: PostView;
  setHasContent: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
}

export default function ContentCreateRepost({ setShowModalRepost, post, setHasContent, className }: CreateRepostProps) {
  const { pubky, createRepost, createTag } = usePubkyClientContext();
  const { addAlert } = useAlertContext();
  const [contentRepost, setContentRepost] = useState('');
  const [isValidContent, setIsValidContent] = useState(false);
  const [sendingRepost, setSendingRepost] = useState(false);
  const [arrayTags, setArrayTags] = useState<string[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  useEffect(() => {
    setHasContent(contentRepost.trim().length > 0 || selectedFiles.length > 0 || arrayTags.length > 0);
  }, [contentRepost, selectedFiles, arrayTags]);

  const handleSubmitRepost = async (content: string) => {
    if (sendingRepost) {
      return;
    }
    try {
      setSendingRepost(true);

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

      const newRepost = await createRepost(post?.details?.id, post?.details?.author, content, postKind, selectedFiles);

      const hashtags = Utils.extractHashtags(content);
      const filteredHashtags = hashtags.filter((tag) => tag.length <= 20);
      const updatedTags = [...new Set([...arrayTags, ...filteredHashtags])];

      if (newRepost) {
        const repostId = parse_uri(newRepost).resource_id!;
        for (const tag of updatedTags) {
          await createTag(pubky ?? '', repostId, tag);
        }
        addAlert(
          <>
            Repost created!{' '}
            <a className="text-[#c8ff00] font-bold hover:text-opacity-90" href={Utils.encodePostUri(newRepost)}>
              View
            </a>
          </>
        );
        setArrayTags([]);
        setContentRepost('');
        setShowModalRepost(false);
        setSelectedFiles([]);
      } else {
        addAlert('Something wrong. Try again', 'warning');
      }
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

      const newRepost = await createRepost(post?.details?.id, post?.details?.author, '', PubkyAppPostKind.Short);

      if (newRepost) {
        addAlert(
          <>
            Repost created!{' '}
            <a className="text-[#c8ff00] font-bold hover:text-opacity-90" href={Utils.encodePostUri(newRepost)}>
              View
            </a>
          </>
        );
        setArrayTags([]);
        setContentRepost('');
        setShowModalRepost(false);
        setSelectedFiles([]);
      } else {
        addAlert('Something wrong. Try again', 'warning');
      }
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
          setIsCompressing={setIsCompressing}
          button={
            <Button.Medium
              id="repost-btn"
              className="w-auto"
              variant="line"
              disabled={sendingRepost || isCompressing}
              loading={sendingRepost}
              onClick={
                !sendingRepost && !isCompressing
                  ? isValidContent || selectedFiles.length > 0
                    ? () => handleSubmitRepost(contentRepost)
                    : () => handleSubmitQuickRepost()
                  : undefined
              }
              icon={<Icon.Repost color={isCompressing ? 'gray' : 'white'} />}
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
            postType="timeline"
            className="mt-2 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-webkit"
            //rounded-bl-none
          />
        </CreateContent>
      </div>
    </div>
  );
}
