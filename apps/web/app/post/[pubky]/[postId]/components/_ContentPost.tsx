'use client';

import { Content } from '@social/ui-shared';
import { Post } from './';
import { usePost, usePostReplies } from '@/hooks/usePost';
import { usePubkyClientContext } from '@/contexts';
import { useEffect, useRef, useState } from 'react';
import { getFile } from '@/services/fileService';
import { PostView, PubkyAppFile } from '@/types/Post';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

export default function ContentPost({
  params,
}: {
  params: Promise<{ pubky: string; postId: string }>;
}) {
  const { pubky } = usePubkyClientContext();
  const limit = 10;
  const [skip, setSkip] = useState(0);
  const [repliesArray, setRepliesArray] = useState<PostView[]>(
    {} as PostView[]
  );
  const [resolvedParams, setResolvedParams] = useState<{
    pubky: string;
    postId: string;
  } | null>(null);

  useEffect(() => {
    params.then((p) => setResolvedParams(p));
  }, [params]);

  const { pubky: paramsPubky, postId: paramsPostId } = resolvedParams ?? {
    pubky: '',
    postId: '',
  };
  const { data, isLoading, isError } = usePost(paramsPubky, paramsPostId);
  const [typeFile, setTypeFile] = useState<'image' | 'video'>();
  const [file, setFile] = useState<PubkyAppFile | null>();
  const {
    data: replies,
    isLoading: isLoadingReplies,
    isError: isErrorReplies,
  } = usePostReplies(paramsPubky, paramsPostId, pubky, skip, limit);
  const fileUri = data?.details?.attachments
    ? data?.details?.attachments[0]
    : '';
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  const postRef = useRef<HTMLDivElement>(null);

  const fetchMoreReplies = () => {
    if (isErrorReplies) return;

    const newRepliesArray = [
      ...(Array.isArray(repliesArray) ? repliesArray : []),
      ...(Array.isArray(replies) ? replies : []),
    ];
    setRepliesArray(newRepliesArray);

    const newSkip = skip + limit;
    setSkip(newSkip);
  };

  const loader = useInfiniteScroll(fetchMoreReplies, isLoadingReplies);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const FetchFile = async () => {
      if (fileUri) {
        const fetchFileResponse = await getFile(fileUri);
        const isVideo =
          fetchFileResponse &&
          fetchFileResponse.content_type.startsWith('video');
        if (isVideo) {
          setTypeFile('video');
        } else {
          setTypeFile('image');
        }
        setFile(fetchFileResponse);
      }
    };
    FetchFile();
  }, [fileUri]);

  let content: React.ReactNode = null;

  if (isLoading) {
    content = <Post.LoadingContent />;
  } else if (isError) {
    content = <Post.NotFoundContent />;
  } else if (data?.details?.content === '[DELETED]') {
    content = <Post.DeletedContent />;
  } else if (data) {
    content = (
      <Post.ValidPostContent
        postRef={postRef}
        data={data}
        windowWidth={windowWidth}
        repliesArray={repliesArray}
        isLoadingReplies={isLoadingReplies}
        loader={loader}
      />
    );
  }

  return (
    <Content.Grid className="flex justify-between flex-col gap-3">
      {content}
    </Content.Grid>
  );
}
