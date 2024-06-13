/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useClientContext } from '../../../../../contexts/client';
import { Post } from '../../../../../components';
import { IPost } from '../../../../../types';
import { Typography } from '@social/ui-shared';

export default function RootParent({ replies }: { replies: any }) {
  const { getPost } = useClientContext();
  const [loadingParents, setLoadingParents] = useState(true);
  const [parentURIs, setParentURIs] = useState<string[]>([]);
  const [parentPosts, setParentPosts] = useState<{
    [uri: string]: IPost | null;
  }>({});

  const fetchParentURIs = async (
    parentURI: string,
    collectedURIs: string[]
  ): Promise<string[]> => {
    if (!parentURI) return collectedURIs;
    collectedURIs.push(parentURI);
    try {
      const parentPost = await getPost(parentURI);
      if (parentPost && parentPost?.post?.parent) {
        return await fetchParentURIs(parentPost.post.parent, collectedURIs);
      }
    } catch (error) {
      console.error('Error fetching parent post:', error);
    }
    return collectedURIs;
  };

  const fetchReplies = async () => {
    try {
      if (replies?.post?.post?.parent) {
        const parentURIList = await fetchParentURIs(
          replies.post.post.parent,
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

  useEffect(() => {
    if (replies) fetchReplies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [replies]);

  useEffect(() => {
    async function fetchParentPosts() {
      if (parentURIs.length === 0) return;
      for (const parentURI of parentURIs) {
        try {
          const contentPost = await getPost(parentURI);
          setParentPosts((prevState) => ({
            ...prevState,
            [parentURI]: contentPost || null,
          }));
        } catch (error) {
          console.error('Error fetching parent post:', error);
          setParentPosts((prevState) => ({
            ...prevState,
            [parentURI]: null,
          }));
        }
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
          ) : (
            <div className="ml-4 px-6 py-2 bg-white bg-opacity-10 rounded-2xl w-[300px]">
              <Typography.Body
                key={parentURI}
                variant="small"
                className="text-opacity-50"
              >
              This post was not found or has been deleted by its author.
              </Typography.Body>
            </div>
          );
        })}
    </>
  );
}
