'use client';

import { Icon, Typography } from '@social/ui-shared';
import { Post, PostsLayout } from '../../components';
import { useEffect, useState } from 'react';
import { useClientContext } from '../../../contexts/client';
import { IPost } from '../../../types';

interface ContactsProps extends React.HTMLAttributes<HTMLDivElement> {
  creatorPubky?: string;
}

export default function Contact({ creatorPubky }: ContactsProps) {
  const { listUserFeed } = useClientContext();
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchPosts();
  }, [creatorPubky, listUserFeed]);

  return (
    <PostsLayout className="grid w-full gap-6 mb-6">
      {posts.length > 0 ? (
        posts.map((post, index) => (
          <Post key={index} post={post} layout="list" className="w-full" />
        ))
      ) : loading ? (
        <div className="mb-4 flex-row">
          <div className={`flex w-full justify-center mt-10`}>
            <Icon.LoadingSpin className="animate-spin text-4xl text-center mx-auto" />
          </div>
          <Typography.Body
            variant="medium-bold"
            className="col-span-3 mt-4 flex justify-center items-center gap-6 text-gray-600"
          >
            Loading Posts
          </Typography.Body>
        </div>
      ) : (
        <Typography.H2 className="font-normal text-opacity-20">
          No posts yet.
        </Typography.H2>
      )}
    </PostsLayout>
  );
}
