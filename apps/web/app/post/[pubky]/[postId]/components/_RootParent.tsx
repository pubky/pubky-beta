import { useEffect, useState } from 'react';
import { Post, Skeleton } from '@/components';
import { IPost, IReply } from '@/types';
import { Typography } from '@social/ui-shared';
import { PostView } from '@/types/Post';

interface ParentPostState {
  [uri: string]: {
    post: IPost | null;
    loading: boolean;
  };
}

export default function RootParent({ replies }: { replies: IReply }) {
  //const { getPost } = useClientContext();
  const [parentURIs, setParentURIs] = useState<string[]>([]);
  const [parentPosts, setParentPosts] = useState<ParentPostState>({});

  useEffect(() => {
    const fetchParentURIs = async (
      parentURI: string,
      collectedURIs: string[]
    ): Promise<string[]> => {
      if (!parentURI) return collectedURIs;
      collectedURIs.push(parentURI);
      try {
        // const parentPost = null; //await getPost(parentURI);
        // if (parentPost && parentPost.post && parentPost.post.parent) {
        //   return await fetchParentURIs(parentPost.post.parent, collectedURIs);
        // }
      } catch (error) {
        console.error('Error fetching parent post:', error);
      }
      return collectedURIs;
    };

    const fetchParentPosts = async () => {
      try {
        if (replies?.post?.post?.parent) {
          const parentURIList = await fetchParentURIs(
            replies.post.post.parent,
            []
          );
          setParentURIs(parentURIList);
        }
      } catch (error) {
        console.error('Error fetching parent URIs:', error);
      }
    };

    if (replies) {
      fetchParentPosts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [replies]);

  useEffect(() => {
    const fetchPost = async (parentURI: string) => {
      try {
        setParentPosts((prevState) => ({
          ...prevState,
          [parentURI]: { post: null, loading: true },
        }));
        const post = null; //await getPost(parentURI);
        setParentPosts((prevState) => ({
          ...prevState,
          [parentURI]: { post: post || null, loading: false },
        }));
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

  if (!allParentPostsLoaded) {
    return <Skeleton.Simple />;
  }

  return parentURIs.map((parentURI, index) => {
    const reversedIndex = parentURIs.length - 1 - index;
    const post = parentPosts[parentURIs[reversedIndex]];

    return post && post.post ? (
      <Post
        key={parentURI}
        post={{} as PostView}
        size="full"
        className={index === 0 ? 'rounded-bl-none' : ''}
        line={!(index === 0)}
      />
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
