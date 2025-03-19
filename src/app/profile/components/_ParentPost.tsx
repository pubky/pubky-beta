'use client';

import { useEffect, useState } from 'react';
import { Post, Skeleton } from '@/components';
import { Typography } from '@social/ui-shared';
import { PostView } from '@/types/Post';
import { getPost } from '@/services/postService';
import { usePubkyClientContext } from '@/contexts';
import { parse_uri } from 'pubky-app-specs';

interface ParentPostState {
  post: PostView | null;
  loading: boolean;
}

export default function ParentPost({ parentURI }: { parentURI: string }) {
  const { pubky } = usePubkyClientContext();
  const [parentPost, setParentPost] = useState<ParentPostState>({
    post: null,
    loading: true
  });
  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (parentURI) {
          const parsed = parse_uri(parentURI);
          if (parsed.resource == 'posts') {
            const authorId = parsed.user_id;
            const postId = parsed.resource_id!;
            const post = await getPost(authorId, postId, pubky ?? '');
            setParentPost({ post: post || null, loading: false });
          } else {
            setParentPost({ post: null, loading: false });
          }
        }
      } catch (error) {
        console.error('Error fetching parent post:', error);
        setParentPost({ post: null, loading: false });
      }
    };

    if (parentURI) {
      fetchPost();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parentURI]);

  if (parentPost.loading) {
    return <Skeleton.Simple />;
  }

  if (!parentPost.post) {
    return (
      <div className="relative ml-4 px-6 py-2 bg-white bg-opacity-10 rounded-lg w-[300px]">
        <Typography.Body variant="small" className="text-opacity-50">
          This post has been deleted by its author.
        </Typography.Body>
      </div>
    );
  }

  return <Post post={parentPost.post} size="full" postType="timeline" />;
}
