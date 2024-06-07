'use client';

import { useEffect, useState } from 'react';
import { useClientContext } from '../../../../../contexts/client';
import { Post } from '../../../../../components';
import { IPost } from '../../../../../types';

export default function RootParent({ post }: { post: IPost }) {
  const { getPost, getReplies } = useClientContext();
  const [loadingParents, setLoadingParents] = useState(true);
  const [parentURIs, setParentURIs] = useState<string[]>([]);
  const [parentPosts, setParentPosts] = useState<{ [uri: string]: IPost }>({});

  const fetchReplies = async () => {
    try {
      const repliesResponse = await getReplies(post.uri);

      if (repliesResponse && repliesResponse.post.post.parent) {
        const parentURIList = await fetchParentURIs(
          repliesResponse.post.post.parent,
          []
        );
        setParentURIs(parentURIList);
        setLoadingParents(false);
      } else {
        setLoadingParents(false);
      }
    } catch (error) {
      console.error('Error:', error);
      setLoadingParents(false);
    }
  };

  const fetchParentURIs = async (
    parentURI: string,
    collectedURIs: string[]
  ): Promise<string[]> => {
    if (!parentURI) return collectedURIs;

    try {
      const parentPost = await getPost(parentURI);
      if (parentPost) {
        collectedURIs.push(parentURI);
        if (parentPost.post && parentPost.post.parent) {
          return await fetchParentURIs(parentPost.post.parent, collectedURIs);
        }
      }
    } catch (error) {
      console.error('Error fetching parent post:', error);
    }
    return collectedURIs;
  };

  const fetchPostParent = async (parentURI: string) => {
    try {
      const contentPost = await getPost(parentURI);
      if (contentPost) {
        setParentPosts((prevState) => ({
          ...prevState,
          [parentURI]: contentPost,
        }));
      }
    } catch (error) {
      console.error('Error fetching parent post:', error);
    }
  };

  useEffect(() => {
    if (post && post.uri) fetchReplies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post]);

  useEffect(() => {
    async function fetchParentPosts() {
      if (parentURIs.length === 0) return;
      for (const parentURI of parentURIs) {
        await fetchPostParent(parentURI);
      }
    }
    fetchParentPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parentURIs]);

  return (
    <>
      {!loadingParents &&
        parentURIs.map((parentURI, index) => {
          const reversedIndex = parentURIs.length - 1 - index;
          const post = parentPosts[parentURIs[reversedIndex]];
          return post ? (
            <Post key={parentURI} post={post} size="full" fullContent />
          ) : null;
        })}
    </>
  );
}
