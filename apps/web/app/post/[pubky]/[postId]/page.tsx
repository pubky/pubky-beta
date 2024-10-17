'use client';

import { Content, Typography } from '@social/ui-shared';
import { CreatePost, Header, Post as PostComponent } from '@/components';
import { Utils } from '@social/utils-shared';
import Skeletons from '@/components/Skeletons';
import { Post } from './components';
import MetaTags from '@/components/MetaTags';
import { usePost, usePostThread } from '@/hooks/usePost';
import { useUserProfile } from '@/hooks/useUser';
import { usePubkyClientContext } from '@/contexts';
import { useEffect, useRef, useState } from 'react';
import { getFile } from '@/services/fileService';
import { PostThread, PubkyAppFile } from '@/types/Post';
import Link from 'next/link';

// Component for Loading Content
function LoadingContent() {
  return <Skeletons.Simple />;
}

// Component for Not Found Content
function NotFoundContent() {
  return (
    <div className="ml-4 px-6 py-2 bg-white bg-opacity-10 rounded-2xl">
      <Typography.Body variant="small" className="text-opacity-50 text-center">
        This post was not found or has been deleted by its author.
        <Link
          href="/home"
          className="ml-2 text-white text-opacity-80 hover:text-opacity-100 cursor-pointer"
        >
          Go home
        </Link>
      </Typography.Body>
    </div>
  );
}

// Component for Deleted Content
function DeletedContent() {
  return (
    <div className="ml-4 px-6 py-2 bg-white bg-opacity-10 rounded-2xl">
      <Typography.Body variant="small" className="text-opacity-50 text-center">
        This post has been deleted by its author.
        <Link
          href="/home"
          className="ml-2 text-white text-opacity-80 hover:text-opacity-100 cursor-pointer"
        >
          Go home
        </Link>
      </Typography.Body>
    </div>
  );
}

// Component for Valid Post Content
function ValidPostContent({
  postRef,
  data,
  windowWidth,
  repliesArray,
  isLoadingReplies,
  loader,
}) {
  return (
    <>
      {data?.relationships?.replied && (
        <Post.RootParent
          postRef={postRef}
          parentURI={data?.relationships?.replied}
        />
      )}

      <div ref={postRef}>
        <PostComponent
          key={data?.details?.uri}
          post={data}
          size="full"
          largeView={windowWidth >= 1280}
          fullContent
          line={Boolean(data?.relationships?.replied)}
        />
      </div>
      <div className="mt-3">
        <Post.ReplyForm
          uri={data?.details.id}
          post={data}
          updatePost={() => console.log('updated')}
          replies={repliesArray}
          isLoadingReplies={isLoadingReplies}
        />
        <div ref={loader} />
      </div>
    </>
  );
}

export default function Index({
  params,
}: {
  params: { pubky: string; postId: string };
}) {
  const limit = 10;
  const [skip, setSkip] = useState(0);
  const [repliesArray, setRepliesArray] = useState<PostThread>(
    {} as PostThread
  );
  const { pubky } = usePubkyClientContext();
  const { data, isLoading, isError } = usePost(params.pubky, params.postId);
  const {
    data: replies,
    isLoading: isLoadingReplies,
    isError: isErrorReplies,
  } = usePostThread(params.pubky, params.postId, pubky, skip, limit);
  const { data: author } = useUserProfile(
    data?.details?.author as string,
    pubky ?? ''
  );
  const [file, setFile] = useState<PubkyAppFile | null>();
  const [typeFile, setTypeFile] = useState<'image' | 'video'>();
  const fileUri = data?.details?.attachments
    ? data?.details?.attachments[0]
    : '';
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  const postRef = useRef<HTMLDivElement>(null);

  const fetchMoreReplies = () => {
    if (isErrorReplies) return;

    const newReplies = {
      root_post: replies?.root_post,
      replies: [...(repliesArray?.replies || []), ...(replies?.replies || [])],
    };
    setRepliesArray(newReplies as PostThread);

    const newSkip = skip + limit;
    setSkip(newSkip);
  };

  const loader = useInfiniteScroll(fetchMoreReplies, isLoadingReplies);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const FetchFile = async () => {
      if (fileUri) {
        const fetchFileResponse = await getFile(fileUri);
        const isVideo =
          fetchFileResponse &&
          fetchFileResponse.content_type.startsWith('video');
        if (isVideo) {
          setTypeFile('video');
        } else {
          setTypeFile('image');
        }
        setFile(fetchFileResponse);
      }
    };
    FetchFile();
  }, [fileUri]);

  let content: React.ReactNode = null;

  if (isLoading) {
    content = <LoadingContent />;
  } else if (isError) {
    content = <NotFoundContent />;
  } else if (data?.details?.content === '[DELETED]') {
    content = <DeletedContent />;
  } else if (data) {
    content = (
      <ValidPostContent
        postRef={postRef}
        data={data}
        windowWidth={windowWidth}
        repliesArray={repliesArray}
        isLoadingReplies={isLoadingReplies}
        loader={loader}
      />
    );
  }

  return (
    <Content.Main>
      <MetaTags
        username={author?.details?.name || 'Pubky App'}
        description={data?.details?.content || 'Post Description'}
        url={Utils.encodePostUri(data?.details?.uri as string)}
        image={typeFile === 'image' ? file?.src : ''}
        video={typeFile === 'video' ? file?.src : ''}
      />
      <Header className="hidden md:block" title="Post" />
      <Content.Grid className="flex justify-between flex-col gap-3">
        {content}
      </Content.Grid>
      <CreatePost />
    </Content.Main>
  );
}

function useInfiniteScroll(fetchPosts: () => void, isLoading: boolean) {
  const loader = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !isLoading) {
          fetchPosts();
        }
      },
      { threshold: 0 }
    );

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => observer.disconnect();
  }, [fetchPosts, isLoading]);

  return loader;
}
