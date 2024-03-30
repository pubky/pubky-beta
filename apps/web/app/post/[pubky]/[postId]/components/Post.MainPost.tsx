'use client';

import { useEffect, useState } from 'react';
import { useClientContext } from '../../../../../contexts/client';
import { Post } from '../../../../components';
import { IPost } from '../../../../../types';

export default function MainPost({ uri }: { uri: string }) {
  const { getPost } = useClientContext();
  const [post, setPost] = useState<IPost>({} as IPost);

  useEffect(() => {
    async function fetchData() {
      if (!uri) return;
      const result = await getPost(uri);
      setPost(result);
    }
    fetchData();
  }, [uri, getPost]);

  return <Post key={uri} post={post} size="full" />;
}
