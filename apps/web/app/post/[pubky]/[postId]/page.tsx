'use client';

//import Link from 'next/link';
//import { useEffect, useState } from 'react';
import { Content } from '@social/ui-shared';
import { CreatePost, Header, Post as PostComponent } from '@/components';
import { Utils } from '@social/utils-shared';
//import { IFileContent, IPost, IReply } from '@/types';
//import { useClientContext, useAlertContext } from '@/contexts';
import Skeletons from '@/components/Skeletons';
import { Post } from './components';
//import MetaTags from '@/components/MetaTags';
import { usePost, usePostThread } from '@/hooks/usePost';

export default function Index({
  params,
}: {
  params: { pubky: string; postId: string };
}) {
  //const { getReplies, getFile } = useClientContext();
  const { data, isLoading } = usePost(
    'pxnu33x7jtpx9ar1ytsi4yxbp6a5o36gwhffs8zoxmbuptici1jy',
    '0RDV7ABDZDW0'
  );
  console.log('dataPost', data);
  const {data: replies} = usePostThread(
    'pxnu33x7jtpx9ar1ytsi4yxbp6a5o36gwhffs8zoxmbuptici1jy',
    '0RDV7ABDZDW0'
  );
  console.log("replies", replies);
  //const { setContent, setShow } = useAlertContext();
  //const [post, setPost] = useState<IPost>({} as IPost);
  //const [showPost, setShowPost] = useState(true);
  //const [loading, setLoading] = useState(true);
  //const [replies, setReplies] = useState<IReply>({} as IReply);
  const uri = Utils.decodePostUri(params.pubky, params.postId);
  //const [file, setFile] = useState<IFileContent | null>();
  //const [typeFile, setTypeFile] = useState<'image' | 'video'>();
  //const fileUri = post?.post?.files ? post?.post?.files[0].fileUri : '';

  {
    /**

  useEffect(() => {
    const FetchFile = async () => {
      if (fileUri) {
        const fetchFileResponse = await getFile(fileUri);
        const isVideo =
          fetchFileResponse &&
          fetchFileResponse.contentType.startsWith('video');
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
    /**f (!showPost) {
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
  }*/
  }
  if (data) {
    content = (
      <>
        {/**replies?.post?.post?.parent && (
          <Post.NavigatorParent replies={replies} />
        )*/}

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
                updatePost={() => console.log("updated")}
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
      {/**<MetaTags
        username={post?.author?.profile?.name || 'Pubky App'}
        description={post?.post?.content || 'Post Description'}
        url={Utils.encodePostUri(post?.uri)}
        image={typeFile === 'image' && file ? file.urls.main : ''}
        video={typeFile === 'video' && file ? file.urls.main : ''}
      />*/}
      <Header className="hidden md:block" title="Post" />
      <Content.Grid className="flex justify-between flex-col gap-3">
        {content}
      </Content.Grid>
      <CreatePost />
    </Content.Main>
  );
}
