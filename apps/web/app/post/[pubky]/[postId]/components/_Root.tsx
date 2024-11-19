'use client';

import { Post } from '.';
import { usePost } from '@/hooks/usePost';
import { useEffect, useState } from 'react';

export default function Root({
  params,
}: {
  params: Promise<{ pubky: string; postId: string }>;
}) {
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

  if (isLoading) {
    return <Post.LoadingContent />;
  }

  if (isError) {
    return <Post.NotFoundContent />;
  }

  if (data?.details?.content === '[DELETED]') {
    return <Post.DeletedContent />;
  }

  return <Post.ValidPostContent postRef={null} data={data} />;
}
