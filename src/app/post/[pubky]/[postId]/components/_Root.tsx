'use client';

import { useEffect, useState } from 'react';

import { usePostContext, usePubkyClientContext } from '@/contexts';
import { Post } from '.';
import { usePost } from '@/hooks/usePost';
import Skeletons from '@/components/Skeletons';
import { Typography } from '@/components/ui-shared';
import Link from 'next/link';

export default function Root({ params }: { params: Promise<{ pubky: string; postId: string }> }) {
  const { pubky, setReplies } = usePubkyClientContext();
  const { setPost } = usePostContext();

  const [resolvedParams, setResolvedParams] = useState<{
    pubky: string;
    postId: string;
  } | null>(null);

  const { pubky: paramsPubky, postId: paramsPostId } = resolvedParams ?? {
    pubky: '',
    postId: ''
  };
  const { data, isLoading, isError } = usePost(paramsPubky, paramsPostId, pubky);

  useEffect(() => {
    setReplies([]);
    return () => {
      setResolvedParams(null);
      setPost(undefined);
    };
  }, []);

  useEffect(() => {
    params.then((p) => setResolvedParams(p));
  }, [params]);

  useEffect(() => {
    if (data) {
      setPost(data);
    }
  }, [data]);

  if (isLoading) {
    return <Skeletons.Simple />;
  }

  if (isError) {
    return (
      <div className="ml-4 px-6 py-2 bg-white bg-opacity-10 rounded-2xl">
        <Typography.Body variant="small" className="text-opacity-50 text-center">
          This post was not found or has been deleted by its author.
          <Link href="/home" className="ml-2 text-white text-opacity-80 hover:text-opacity-100 cursor-pointer">
            Go home
          </Link>
        </Typography.Body>
      </div>
    );
  }

  if (data?.details?.content === '[DELETED]') {
    return (
      <div className="ml-4 px-6 py-2 bg-white bg-opacity-10 rounded-lg">
        <Typography.Body variant="small" className="text-opacity-50 text-center">
          This post has been deleted by its author.
          <Link href="/home" className="ml-2 text-white text-opacity-80 hover:text-opacity-100 cursor-pointer">
            Go home
          </Link>
        </Typography.Body>
      </div>
    );
  }

  return <Post.ValidPostContent postRef={null} data={data} />;
}
