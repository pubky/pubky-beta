'use client';

//import Link from 'next/link';
//import { useEffect, useState } from 'react';
import { Content, Typography } from '@social/ui-shared';
import { CreatePost, Header, Post as PostComponent } from '@/components';
import { Utils } from '@social/utils-shared';
//import { IFileContent, IPost, IReply } from '@/types';
//import { useClientContext, useAlertContext } from '@/contexts';
import Skeletons from '@/components/Skeletons';
import { Post } from './components';
//import MetaTags from '@/components/MetaTags';
import { usePost, usePostThread } from '@/hooks/usePost';
import MetaTags from '@/components/MetaTags';
import { useUserProfile } from '@/hooks/useUser';
import { usePubkyClientContext } from '@/contexts';
import { useEffect, useState } from 'react';
import { getFile } from '@/services/fileService';
import { PubkyAppFile } from '@/types/Post';
import Link from 'next/link';

export default function Index({
  params,
}: {
  params: { pubky: string; postId: string };
}) {
  //const { getReplies, getFile } = useClientContext();
  const { pubky } = usePubkyClientContext();
  const { data, isLoading, isError } = usePost(params.pubky, params.postId);
  const { data: replies } = usePostThread(params.pubky, params.postId);
  const { data: author } = useUserProfile(
    data?.details?.author as string,
    pubky ?? ''
  );
  //const { setContent, setShow } = useAlertContext();
  //const [post, setPost] = useState<IPost>({} as IPost);
  //const [showPost, setShowPost] = useState(true);
  //const [loading, setLoading] = useState(true);
  //const [replies, setReplies] = useState<IReply>({} as IReply);
  const uri = Utils.decodePostUri(params.pubky, params.postId);
  const [file, setFile] = useState<PubkyAppFile | null>();
  const [typeFile, setTypeFile] = useState<'image' | 'video'>();
  const fileUri = data?.files ? data?.files[0]?.uri : '';

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileUri]);

  {
    /**
  
    useEffect(() => {
    async function fetchData() {
      if (!uri) return;
      const result = await getReplies(uri);

      if (result) {
        if (result.post) {
          setPost(result.post);
        } else {
          setShowPost(false);
        }
        setReplies(result);
        setLoading(false);
      }
    }
    fetchData();
  }, [uri, getReplies]);

  const handleUpdatePost = async () => {
    const result = await getReplies(uri);
    if (result) {
      setPost(result.post);
      setReplies(result);
      setContent('Reply created!');
      setShow(true);
    } else {
      setContent('Something went wrong. Try again', 'warning');
      setShow(true);
    }
  };
  */
  }

  let content;

  {
    if (isError) {
      content = (
        <div className="ml-4 px-6 py-2 bg-white bg-opacity-10 rounded-2xl">
          <Typography.Body
            variant="small"
            className="text-opacity-50 text-center"
          >
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
  }
  if (data) {
    content = (
      <>
        {data?.relationships?.replied && (
          <Link href={Utils.encodePostUri2(data?.relationships?.replied)}>
            <Typography.Body>Go to root</Typography.Body>
          </Link>
          //<Post.NavigatorParent replies={replies} />
        )}

        {isLoading ? (
          <Skeletons.Simple />
        ) : (
          <>
            <PostComponent
              key={uri}
              post={data}
              size="full"
              largeView={true}
              fullContent
            />
            <div className="mt-3">
              <Post.ReplyForm
                uri={uri}
                post={data}
                updatePost={() => console.log('updated')}
                replies={replies}
              />
            </div>
          </>
        )}
      </>
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
