import type { Metadata } from 'next';
import { Content } from '@social/ui-shared';
import { Utils } from '@social/utils-shared';

import { getSeoMetadata } from '@components/HeaderSEO';
import { CreatePost } from '@/components';
import { Post } from './components';
import * as Components from '@/components';

import { getFile } from '@/services/fileService';
import { getUserDetails } from '@/services/userService';
import { PubkyAppPostKind } from 'pubky-app-specs';

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
    const fileUrl = fetchedFile && JSON.parse(fetchedFile?.urls).main;
    const image = fileUrl ? `${BASE_URL}/static/files/${fileUrl}` : undefined;

    let postTitle = '';
    let description = '';

    if (post?.details?.kind === PubkyAppPostKind[1].toLocaleLowerCase()) {
      const parsedContent = JSON.parse(post?.details?.content);
      postTitle = Utils.truncateText(parsedContent.title, 20);
      const firstParagraph = parsedContent.body.replace(/<[^>]*>/g, '').split('\n')[0];
      description = Utils.truncateText(firstParagraph, 100);
    } else {
      postTitle = Utils.truncateText(post.details.content, 50);
      description = Utils.truncateText(post.details.content, 100);
    }

    const profile = await getUserDetails(post?.details.author);
    const profileName = Utils.truncateText(profile?.name, 20);

    let title = `${profileName} on Pubky`;

    if (postTitle && post?.details?.kind === PubkyAppPostKind[1].toLocaleLowerCase()) {
      title = `${postTitle} | ${profileName} on Pubky`;
    }

    const metadata = getSeoMetadata({
      title,
      description,
      image: fileType?.startsWith('image/') ? image : undefined
    });

    return metadata;
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
    <Content.Main className="pt-[80px]">
      <Post.Header />

      <Content.Grid className="flex justify-between flex-col gap-3">
        <Post.Root params={params} />
      </Content.Grid>

      <CreatePost />
      <Components.FooterMobile />
    </Content.Main>
  );
}
