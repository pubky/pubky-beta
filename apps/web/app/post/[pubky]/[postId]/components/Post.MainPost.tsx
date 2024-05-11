'use client';

import { useEffect, useState } from 'react';
import { useClientContext } from '../../../../../contexts/client';
import { Post } from '../../../../components';
import { IPost } from '../../../../../types';
import { Icon, Typography } from '@social/ui-shared';

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
        <>
          <div className={`flex w-full justify-center mt-10`}>
            <Icon.LoadingSpin className="animate-spin text-4xl text-center mx-auto" />
          </div>
          <Typography.Body
            variant="medium-bold"
            className="col-span-3 -mt-6 flex justify-center items-center gap-6 text-opacity-20"
          >
            Loading Post Content
          </Typography.Body>
        </>
      ) : (
        <Post key={uri} post={post} size="full" fullContent />
      )}
    </>
  );
}
