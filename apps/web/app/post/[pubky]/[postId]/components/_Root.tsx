'use client';

import { Post } from '.';
import { usePost, usePostReplies } from '@/hooks/usePost';
import { usePubkyClientContext } from '@/contexts';
import { useEffect, useRef, useState } from 'react';

export default function Root({
  params,
}: {
  params: Promise<{ pubky: string; postId: string }>;
}) {
  const limit = 1;

  const { pubky } = usePubkyClientContext();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [skip, setSkip] = useState(0);

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

  const { data: replies, isLoading: isLoadingReplies } = usePostReplies(
    paramsPubky,
    paramsPostId,
    pubky,
    skip,
    limit
  );

  const repliesKeyValue =
    replies?.reduce((acc, reply) => {
      if (reply?.details?.id) {
        acc[reply.details.id] = reply;
      }
      return acc;
    }, {} as Record<string, (typeof replies)[number]>) || {};

  const lastReplyElementRef = useRef<HTMLDivElement | null>(null);

  if (isLoading) {
    return <Post.LoadingContent />;
  }

  if (isError) {
    return <Post.NotFoundContent />;
  }

  if (data?.details?.content === '[DELETED]') {
    return <Post.DeletedContent />;
  }

  return (
    <Post.ValidPostContent
      postRef={null}
      data={data}
      replies={repliesKeyValue}
      isLoadingReplies={isLoadingReplies}
      lastReplyRef={lastReplyElementRef}
    />
  );
}
