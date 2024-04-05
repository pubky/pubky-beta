'use client';

import { Content } from '@social/ui-shared';
import { Post } from './components';
import { CreatePost, Header } from '../../../components';
import { decodePostUri } from '../../../../libs/pubkyHelper';

export default function Index({
  params,
}: {
  params: { pubky: string; postId: string };
}) {
  return (
    <Content.Main>
      <Header className="hidden md:block" title="Post" />
      <Content.Grid className="flex justify-between flex-col gap-12">
        <Post.MainPost uri={decodePostUri(params.pubky, params.postId)} />
        {/* <Post.ReplyForm />
        <Post.Replies /> */}
      </Content.Grid>
      <CreatePost />
    </Content.Main>
  );
}
