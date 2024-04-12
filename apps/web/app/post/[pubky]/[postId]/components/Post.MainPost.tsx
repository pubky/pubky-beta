'use client';

import { useEffect, useState } from 'react';
import { useClientContext } from '../../../../../contexts/client';
import { Post, Skeleton } from '../../../../components';
import { IPost } from '../../../../../types';

export default function MainPost({ uri }: { uri: string }) {
  const { getPost } = useClientContext();
  const [post, setPost] = useState<IPost>({} as IPost);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!uri) return;
      const result = await getPost(uri);

      if (result) {
        setPost(result);
        setLoading(false);
      }
    }
    fetchData();
  }, [uri, getPost]);

  return (
    <>
      {loading ? <Skeleton.Post /> : <Post key={uri} post={post} size="full" />}
    </>
  );
}
