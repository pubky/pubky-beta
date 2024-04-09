/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Typography } from '@social/ui-shared';
import { Post, PostsLayout } from '../../components';
import { useEffect, useState } from 'react';
import { useClientContext } from '../../../contexts/client';

interface ContactsProps extends React.HTMLAttributes<HTMLDivElement> {
  creatorPubky?: string;
}

export default function Contact({ creatorPubky }: ContactsProps) {
  const { listUserFeed } = useClientContext();
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        if (!creatorPubky) return;

        const results = await listUserFeed(creatorPubky, '', 2);

        if (!results || !results.feed) return;

        setPosts(results.feed);
      } catch (error) {
        console.log(error);
      }
    }
    fetchPosts();
  }, [creatorPubky, listUserFeed]);

  return (
    <PostsLayout className="grid w-full gap-6 mb-6">
      {posts.length > 0 ? (
        posts.map((post, index) => (
          <Post key={index} post={post} layout="list" className="w-full" />
        ))
      ) : (
        <Typography.H2 className="font-normal text-opacity-20">
          No posts yet.
        </Typography.H2>
      )}
    </PostsLayout>
  );
}
