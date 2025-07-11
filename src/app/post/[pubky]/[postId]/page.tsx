import type { Metadata } from 'next';
import { Utils } from '@social/utils-shared';
import { getSeoMetadata } from '@components/HeaderSEO';
import { getFile } from '@/services/fileService';
import { getUserDetails } from '@/services/userService';
import { PubkyAppPostKind } from 'pubky-app-specs';
import PostPage from './PostPage';

const NEXT_PUBLIC_NEXUS = process.env.NEXT_PUBLIC_NEXUS;
const BASE_URL = `${NEXT_PUBLIC_NEXUS}`;

type Props = {
  params: { pubky: string; postId: string };
};

export async function generateMetadata({ params }: { params: { pubky: string; postId: string } }): Promise<Metadata> {
  const { pubky, postId } = params;

  try {
    const response = await fetch(`${BASE_URL}/v0/post/${pubky}/${postId}`);
    const post = await response.json();
    const fetchedFile = post?.details?.attachments?.length > 0 && (await getFile(post?.details?.attachments[0]));
    const fileType = fetchedFile?.content_type;
    const fileUrl = fetchedFile && JSON.parse(fetchedFile?.urls).main;
    const imageUrl = fileUrl ? `${BASE_URL}/static/files/${fileUrl}` : undefined;
    const profile = await getUserDetails(post?.details.author);
    const profileName = Utils.truncateText(profile?.name, 20);

    // DEFAULT SEO
    let title = `${profileName} on Pubky`;
    let description = Utils.truncateText(post.details.content, 100);
    let image = fileType?.startsWith('image/') ? imageUrl : undefined;

    // LONG POST
    if (post?.details?.kind === PubkyAppPostKind[1].toLocaleLowerCase()) {
      const parsedContent = JSON.parse(post?.details?.content);
      const postTitle = Utils.truncateText(parsedContent.title, 20);
      const firstParagraph = parsedContent.body.replace(/<[^>]*>/g, '').split('\n')[0];

      title = `${postTitle} | ${profileName} on Pubky`;
      description = Utils.truncateText(firstParagraph, 100);
    }

    const metadata = getSeoMetadata({
      title,
      description,
      image
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

export default function PostOverlayPage({ params }: Props) {
  return <PostPage params={params} />;
} 