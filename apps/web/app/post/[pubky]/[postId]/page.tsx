'use client';

import { Content } from '@social/ui-shared';
import { Post } from './components';
import { CreatePost, Header } from '../../../../components';
import { Utils } from '../../../../utils';

export default function Index({
  params,
}: {
  params: { pubky: string; postId: string };
}) {
  return (
    <Content.Main>
      <Header className="hidden md:block" title="Post" />
      <Content.Grid className="flex justify-between flex-col gap-12">
        <Post.MainPost uri={Utils.decodePostUri(params.pubky, params.postId)} />
        <Post.ReplyForm
          uri={Utils.decodePostUri(params.pubky, params.postId)}
        />
        <Post.Replies uri={Utils.decodePostUri(params.pubky, params.postId)} />
      </Content.Grid>
      <CreatePost />
    </Content.Main>
  );
}
