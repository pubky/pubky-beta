'use client';

import { useEffect, useState } from 'react';
import { Post, Skeleton } from '@/components';
import { Typography } from '@social/ui-shared';
import { PostView } from '@/types/Post';
import { getPost } from '@/services/postService';
import { usePubkyClientContext } from '@/contexts';
import { parse_uri } from 'pubky-app-specs';

interface ParentPostState {
  [uri: string]: {
    post: PostView | null;
    loading: boolean;
  };
}

export default function RootParent({
  parentURI,
  postRef
}: {
  parentURI: string;
  postRef: React.RefObject<HTMLDivElement>;
}) {
  const { pubky } = usePubkyClientContext();
  const [isMobile, setIsMobile] = useState(false);
  const [parentURIs, setParentURIs] = useState<string[]>([]);
  const [parentPosts, setParentPosts] = useState<ParentPostState>({});

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1280);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fetchParentURIs = async (parentURI: string, collectedURIs: string[]): Promise<string[]> => {
      if (!parentURI) return collectedURIs;
      collectedURIs.push(parentURI);
      try {
        const parsed = parse_uri(parentURI);
        if (parsed.resource == 'posts') {
          const authorId = parsed.user_id;
          const postId = parsed.resource_id!;
          const parentPost = await getPost(authorId, postId, pubky ?? '');
          if (parentPost?.relationships?.replied) {
            return await fetchParentURIs(parentPost?.relationships?.replied, collectedURIs);
          }
        }
      } catch (error) {
        console.error('Error fetching parent post:', error);
      }
      return collectedURIs;
    };

    const fetchParentPosts = async () => {
      try {
        if (parentURI) {
          const parentURIList = await fetchParentURIs(parentURI, []);
          setParentURIs(parentURIList);
        }
      } catch (error) {
        console.error('Error fetching parent URIs:', error);
      }
    };

    if (parentURI) {
      fetchParentPosts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parentURI]);

  useEffect(() => {
    const fetchPost = async (parentURI: string) => {
      try {
        setParentPosts((prevState) => ({
          ...prevState,
          [parentURI]: { post: null, loading: true }
        }));
        const parsed = parse_uri(parentURI);
        if (parsed.resource == 'posts') {
          const authorId = parsed.user_id;
          const postId = parsed.resource_id!;
          const post = await getPost(authorId, postId, pubky ?? '');
          setParentPosts((prevState) => ({
            ...prevState,
            [parentURI]: { post: post || null, loading: false }
          }));
        }
      } catch (error) {
        console.error('Error fetching parent post:', error);
        setParentPosts((prevState) => ({
          ...prevState,
          [parentURI]: { post: null, loading: false }
        }));
      }
    };

    parentURIs.forEach((parentURI) => {
      if (!parentPosts[parentURI]) {
        fetchPost(parentURI);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parentURIs, parentPosts]);

  const allParentPostsLoaded = parentURIs.every((uri) => parentPosts[uri]?.loading === false);

  useEffect(() => {
    if (allParentPostsLoaded && postRef?.current) {
      postRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [allParentPostsLoaded, postRef]);

  if (!allParentPostsLoaded) {
    return <Skeleton.Simple />;
  }

  return parentURIs.map((parentURI, index) => {
    const reversedIndex = parentURIs.length - 1 - index;
    const post = parentPosts[parentURIs[reversedIndex]];
    const isLine = index > 0;

    if (!post?.post)
      return (
        <div key={parentURI} className="relative ml-4 px-6 py-2 bg-white bg-opacity-10 rounded-lg w-[300px]">
          <Typography.Body variant="small" className="text-opacity-50">
            This post has been deleted by its author.
          </Typography.Body>
          <div className="absolute -ml-[1px] mt-1.5 border-l-[1px] border-[#444447] h-[50px]" />
        </div>
      );

    return (
      <div key={parentURI}>
        <Post homeView post={post.post} size="full" largeView={!isMobile} line={isLine} postType="timeline" />
      </div>
    );
  });
}
