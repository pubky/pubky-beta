'use client';

import { useEffect, useState } from 'react';
import { useClientContext } from '../../../../../contexts/client';
import { Post } from '../../../../../components';
import { IPost } from '../../../../../types';
import Skeletons from '../../../../../components/Skeletons';

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
      {loading ? (
        <Skeletons.Simple />
      ) : (
        <Post key={uri} post={post} size="full" fullContent />
      )}
    </>
  );
}
