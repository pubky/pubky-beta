import { useEffect, useState } from 'react';
import { Skeleton } from '@/components';
import { IPost, IReply } from '@/types';
import { Content } from '@social/ui-shared';
import Skeletons from '@/components/Skeletons';

interface NavigatorParentProps {
  [uri: string]: {
    post: IPost | null;
    loading: boolean;
  };
}

export default function NavigatorParent({ replies }: { replies: IReply }) {
  //const { getPost } = useClientContext();
  const [parentURIs, setParentURIs] = useState<string[]>([]);
  const [parentPosts, setParentPosts] = useState<NavigatorParentProps>({});

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

  return (
    <>
      {parentURIs && parentURIs.length > 0 ? (
        <Content.StepperReplies
          className="mb-4"
          postUri={replies.post.uri}
          urls={parentURIs.slice().reverse()}
        />
      ) : (
        <Skeletons.Simple />
      )}
    </>
  );
}
