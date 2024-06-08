'use client';

import { useEffect, useState } from 'react';
import { Content } from '@social/ui-shared';
import { Post } from './components';
import { CreatePost, Header } from '../../../../components';
import { Utils } from '../../../../utils';
import { IPost } from '../../../../types';
import { useClientContext } from '../../../../contexts/client';

export default function Index({
  params,
}: {
  params: { pubky: string; postId: string };
}) {
  const { getReplies } = useClientContext();
  const [post, setPost] = useState<IPost>({} as IPost);
  const [loading, setLoading] = useState(true);
  const [replies, setReplies] = useState({});
  const uri = Utils.decodePostUri(params.pubky, params.postId);

  useEffect(() => {
    async function fetchData() {
      if (!uri) return;
      const result = await getReplies(uri);

      if (result) {
        setPost(result.post);
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

  return (
    <Content.Main>
      <Header className="hidden md:block" title="Post" />
      <Content.Grid className="flex justify-between flex-col gap-12">
        <Post.RootParent replies={replies} />

        <div id="mainPost">
          <Post.MainPost post={post} loading={loading} uri={uri} />
        </div>

        <Post.ReplyForm uri={uri} />
        <Post.Replies repliesResponse={replies} />
      </Content.Grid>
      <CreatePost />
    </Content.Main>
  );
}
