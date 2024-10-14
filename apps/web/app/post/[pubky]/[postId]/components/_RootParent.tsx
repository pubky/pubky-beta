import { useEffect, useState } from 'react';
import { Post, Skeleton } from '@/components';
import { Typography } from '@social/ui-shared';
import { PostView } from '@/types/Post';
import { getPost } from '@/services/postService';
import { usePubkyClientContext } from '@/contexts';

interface ParentPostState {
  [uri: string]: {
    post: PostView | null;
    loading: boolean;
  };
}

export default function RootParent({
  parentURI,
  postRef,
}: //onParentPostsCountChange,
{
  parentURI: string;
  postRef: any;
  //onParentPostsCountChange: (count: number) => void;
}) {
  const { pubky } = usePubkyClientContext();
  const [parentURIs, setParentURIs] = useState<string[]>([]);
  const [parentPosts, setParentPosts] = useState<ParentPostState>({});
  const regex =
    /pubky:\/\/([a-zA-Z0-9]+)\/pub\/pubky\.app\/posts\/([a-zA-Z0-9]+)/;

  useEffect(() => {
    const fetchParentURIs = async (
      parentURI: string,
      collectedURIs: string[]
    ): Promise<string[]> => {
      if (!parentURI) return collectedURIs;
      collectedURIs.push(parentURI);
      try {
        const match = parentURI.match(regex);
        if (match) {
          const authorId = match[1];
          const postId = match[2];
          const parentPost = await getPost(authorId, postId, pubky ?? '');
          if (parentPost?.relationships?.replied) {
            return await fetchParentURIs(
              parentPost?.relationships?.replied,
              collectedURIs
            );
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
          //onParentPostsCountChange(parentURIList.length);
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
          [parentURI]: { post: null, loading: true },
        }));
        const match = parentURI.match(regex);
        if (match) {
          const authorId = match[1];
          const postId = match[2];
          const post = await getPost(authorId, postId, pubky ?? '');
          setParentPosts((prevState) => ({
            ...prevState,
            [parentURI]: { post: post || null, loading: false },
          }));
        }
      } catch (error) {
        console.error('Error fetching parent post:', error);
        setParentPosts((prevState) => ({
          ...prevState,
          [parentURI]: { post: null, loading: false },
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

  const allParentPostsLoaded = parentURIs.every(
    (uri) => parentPosts[uri]?.loading === false
  );

  useEffect(() => {
    if (allParentPostsLoaded && postRef.current) {
      postRef.current.scrollIntoView();
    }
  }, [allParentPostsLoaded]);

  if (!allParentPostsLoaded) {
    return <Skeleton.Simple />;
  }

  return parentURIs.map((parentURI, index) => {
    const reversedIndex = parentURIs.length - 1 - index;
    const post = parentPosts[parentURIs[reversedIndex]];

    //const marginLeftValue = index > 1 ? index * 12 : '';
    const isLine = index > 0;

    return post && post.post ? (
      <div
        key={parentURI}
        //style={{ marginLeft: `${marginLeftValue}px` }}
      >
        <Post post={post.post} size="full" largeView line={isLine} />
      </div>
    ) : (
      <div
        key={parentURI}
        className="relative ml-4 px-6 py-2 bg-white bg-opacity-10 rounded-2xl w-[300px]"
      >
        <Typography.Body variant="small" className="text-opacity-50">
          This post was not found or has been deleted by its author.
        </Typography.Body>
        <div className="absolute -ml-1 mt-1.5 border-l-2 border-neutral-800 h-[50px]" />
      </div>
    );
  });
}
