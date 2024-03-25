'use client';

import { useEffect, useState } from 'react';
import { useClientContext } from '../../../contexts/client';
import { Post } from '../../components';

type PostResult = {
  uri: string;
  content: string;
  payload: {
    content: string;
  };
  createdAt: string | Date | null;
  id: string;
};

export default function MainPost({ uri }: { uri: string }) {
  const { getPost } = useClientContext();
  const [post, setPost] = useState<PostResult>({} as PostResult);

  useEffect(() => {
    async function fetchData() {
      if (!uri) return;
      const result = await getPost(uri);
      setPost(result);
    }
    fetchData();
  }, [uri, getPost]);

  return <Post key={uri} postId={post} size="full" />;
}
