import type { Metadata } from 'next';
import { Content, Icon } from '@social/ui-shared';
import { Utils } from '@social/utils-shared';

import { getSeoMetadata } from '@components/HeaderSEO';
import { CreatePost } from '@/components';
import * as Components from '@/components';

import { getFile } from '@/services/fileService';
import { getUserDetails } from '@/services/userService';
import { PubkyAppPostKind } from 'pubky-app-specs';
import { PostWrapper } from '@/contexts';
import { PostPage } from './PostPage';
import { Header } from './components/_Header';

const NEXT_PUBLIC_NEXUS = process.env.NEXT_PUBLIC_NEXUS;
const BASE_URL = `${NEXT_PUBLIC_NEXUS}`;

type Props = {
  params: Promise<{ pubky: string; postId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pubky, postId } = await params;

  try {
    const response = await fetch(`${BASE_URL}/v0/post/${pubky}/${postId}`);
    const post = await response.json();
    const fetchedFile = post?.details?.attachments && (await getFile(post?.details?.attachments[0]));
    const fileType = fetchedFile?.content_type;

    let file = null;
    try {
      file = fetchedFile && `${BASE_URL}/static/files/${JSON.parse(fetchedFile?.urls || '{}').main}`;
    } catch (error) {
      console.error('Error parsing URL JSON:', error);
    }

    // title with just 20 characters
    let postTitle = '';
    try {
      postTitle =
        post?.details?.kind === PubkyAppPostKind[1].toLocaleLowerCase()
          ? Utils.truncateText(JSON.parse(post?.details?.content || '{}').title || '', 50)
          : Utils.truncateText(post.details.content, 50);
    } catch (error) {
      console.error('Error parsing content JSON:', error);
      postTitle = Utils.truncateText(post.details.content, 50);
    }

    const profile = await getUserDetails(post?.details.author);
    const profileName = Utils.truncateText(profile?.name, 20);
    const description = Utils.truncateText(post.details.content, 100);

    let title = `${profileName}`;

    if (postTitle) {
      title = `${postTitle} | ${profileName}`;
    }

    let image = undefined;

    if (fileType?.startsWith('image/')) {
      image = file;
    }

    return getSeoMetadata({
      title,
      description,
      image
    });
  } catch (error) {
    return getSeoMetadata({
      title: '404 | Post',
      description: 'Post not found or an error occurred'
      // image: `${BASE_URL}/default-error-image.png`, // TODO: Add default error image
    });
  }
}

export default async function Index({ params }: Props) {
  return (
    <PostWrapper>
      <Content.Main className="pt-[80px]">
        <Header />
        <Content.Grid className="flex justify-between flex-col gap-3">
          <PostPage params={params} />
        </Content.Grid>
        <CreatePost />
        <Components.FooterMobile />
      </Content.Main>
    </PostWrapper>
  );
}
