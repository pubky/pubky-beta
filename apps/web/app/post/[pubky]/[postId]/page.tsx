import { Content } from '@social/ui-shared';
import { CreatePost, Header } from '@/components';
import { Post } from './components';
import * as Components from '@/components';
import type { Metadata } from 'next';
import { Utils } from '@social/utils-shared';

const NEXT_PUBLIC_NEXUS = process.env.NEXT_PUBLIC_NEXUS;
const BASE_URL = `${NEXT_PUBLIC_NEXUS}/v0`;

type Props = {
  params: Promise<{ pubky: string; postId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pubky, postId } = await params;

  const response = await fetch(`${BASE_URL}/post/${pubky}/${postId}`);
  const post = await response.json();

  // title with just 20 characters
  const postTilte = Utils.truncateText(post.details.content, 20);
  const postDescrition = Utils.truncateText(post.details.content, 100);

  // TODO get images from post or previous images
  // and add to openGraph

  // TODO improve title with name of the author

  return {
    title: `${postTilte} | Post`,
    description: postDescrition,
    // openGraph: {
    //   images: post.images || previousImages,
    // },
  };
}

export default async function Index({ params }: Props) {
  return (
    <Content.Main>
      <Header className="hidden md:block" title="Post" />

      <Content.Grid className="flex justify-between flex-col gap-3">
        <Post.Root params={params} />
      </Content.Grid>

      <CreatePost />
      <Components.FooterMobile />
    </Content.Main>
  );
}
