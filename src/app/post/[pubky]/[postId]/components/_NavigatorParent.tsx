'use client';

import { useEffect, useState } from 'react';
import { Skeleton } from '@/components';
import { Content } from '@social/ui-shared';
import Skeletons from '@/components/Skeletons';
import { getPost } from '@/services/postService';
import { usePubkyClientContext } from '@/contexts';
import { PostView } from '@/types/Post';
import { parse_uri } from 'pubky-app-specs';

interface NavigatorParentProps {
  [uri: string]: {
    post: PostView | null;
    loading: boolean;
  };
}

export default function NavigatorParent({ parentPost }: { parentPost: string }) {
  const { pubky } = usePubkyClientContext();
  const [parentURIs, setParentURIs] = useState<string[]>([]);
  const [parentPosts, setParentPosts] = useState<NavigatorParentProps>({});

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
        if (parentPost) {
          const parentURIList = await fetchParentURIs(parentPost, []);
          setParentURIs(parentURIList);
        }
      } catch (error) {
        console.error('Error fetching parent URIs:', error);
      }
    };

    if (parentPost) {
      fetchParentPosts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parentPost]);

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

  if (!allParentPostsLoaded) {
    return <Skeleton.Simple />;
  }

  return (
    <>
      {parentURIs && parentURIs.length > 0 ? (
        <Content.StepperReplies
          className="mb-4"
          postUri={parentPost}
          urls={parentURIs.slice().reverse().slice(0, -1)}
        />
      ) : (
        <Skeletons.Simple />
      )}
    </>
  );
}
