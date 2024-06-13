'use client';

import { useEffect, useState } from 'react';
import { Content, Typography } from '@social/ui-shared';
import { Post } from './components';
import { CreatePost, Header } from '../../../../components';
import { Utils } from '../../../../utils';
import { IPost } from '../../../../types';
import { useClientContext } from '../../../../contexts/client';
import Link from 'next/link';
import { useAlertContext } from '../../../../contexts/alerts';

export default function Index({
  params,
}: {
  params: { pubky: string; postId: string };
}) {
  const { getReplies } = useClientContext();
  const { setContent, setShow } = useAlertContext();
  const [post, setPost] = useState<IPost>({} as IPost);
  const [showPost, setShowPost] = useState(true);
  const [loading, setLoading] = useState(true);
  const [replies, setReplies] = useState({});
  const uri = Utils.decodePostUri(params.pubky, params.postId);

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

  useEffect(() => {
    const timer = setTimeout(() => {
      const mainPostElement = document.getElementById('mainPost');
      if (mainPostElement) {
        const headerHeight =
          document.querySelector('header')?.offsetHeight || 0;
        const scrollPosition = mainPostElement.offsetTop - headerHeight - 25;
        window.scrollTo({ top: scrollPosition });
      }
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleUpdatePost = async () => {
    const result = await getReplies(uri);
    if (result) {
      setPost(result.post);
      setReplies(result);
      setContent('Reply created!');
      setShow(true);
    }
  };

  return (
    <Content.Main>
      <Header className="hidden md:block" title="Post" />
      <Content.Grid className="flex justify-between flex-col gap-12">
        {showPost ? (
          <>
            <Post.RootParent replies={replies} />

            <div id="mainPost">
              <Post.MainPost post={post} loading={loading} uri={uri} />
            </div>

            <Post.ReplyForm uri={uri} updatePost={handleUpdatePost} />
            <Post.Replies repliesResponse={replies} />
          </>
        ) : (
          <div className="ml-4 px-6 py-2 bg-white bg-opacity-10 rounded-2xl">
            <Typography.Body
              variant="small"
              className="text-opacity-50 text-center"
            >
              This post was not found or has been deleted by its author.
              <Link
                href="/home"
                className="ml-2 text-fuchsia-500 text-opacity-80 hover:text-opacity-100 cursor-pointer"
              >
                Go home
              </Link>
            </Typography.Body>
          </div>
        )}
      </Content.Grid>
      <CreatePost />
    </Content.Main>
  );
}
