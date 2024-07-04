'use client';

import { Typography } from '@social/ui-shared';
import { Post, PostsLayout } from '@/components';
import { useEffect, useState } from 'react';
import { useClientContext } from '@/contexts';
import { IPost } from '@/types';
import Skeletons from '@/components/Skeletons';

interface ContactsProps extends React.HTMLAttributes<HTMLDivElement> {
  creatorPubky?: string;
}

export default function Contact({ creatorPubky }: ContactsProps) {
  const { listUserFeed } = useClientContext();
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchPosts() {
    try {
      if (!creatorPubky) return;

      const results = await listUserFeed(creatorPubky, '', 2);

      setLoading(false);

      if (!results || !results.feed) return;

      setPosts(results.feed);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PostsLayout className="grid w-full gap-6 mb-6">
      {posts.length > 0 ? (
        posts.map((post, index) => (
          <Post
            key={`${index}-${post.id}`}
            post={post}
            layout="list"
            className="w-full"
          />
        ))
      ) : loading ? (
        <Skeletons.Simple />
      ) : (
        <Typography.H2 className="font-normal text-opacity-20">
          No posts yet.
        </Typography.H2>
      )}
    </PostsLayout>
  );
}
