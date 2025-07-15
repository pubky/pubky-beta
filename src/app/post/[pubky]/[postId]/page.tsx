import type { Metadata } from 'next';
import { Utils } from '@social/utils-shared';
import { getPost } from '@/services/postService';
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
    // Fetch the post data
    const post = await getPost(pubky, postId, '');

    if (!post) {
      return {
        title: '404 | Post',
        description: 'Post not found or an error occurred'
      };
    }

    // Fetch additional data for SEO
    const fetchedFile = post?.details?.attachments?.length > 0 && (await getFile(post?.details?.attachments[0]));
    const fileType = fetchedFile?.content_type;
    const fileUrl = fetchedFile && JSON.parse(fetchedFile?.urls).main;
    const imageUrl = fileUrl ? `${BASE_URL}/static/files/${fileUrl}` : undefined;
    const profile = await getUserDetails(post?.details.author);
    const profileName = Utils.truncateText(profile?.name, 20);

    // Generate SEO metadata
    let title = `${profileName} on Pubky`;
    let description = Utils.truncateText(post.details.content, 100);
    let image = fileType?.startsWith('image/') ? imageUrl : undefined;

    // Handle long posts (articles)
    if (String(post?.details?.kind) === PubkyAppPostKind[1].toLocaleLowerCase()) {
      try {
        const parsedContent = JSON.parse(post?.details?.content);
        const postTitle = Utils.truncateText(parsedContent.title, 20);
        const firstParagraph = parsedContent.body.replace(/<[^>]*>/g, '').split('\n')[0];

        title = `${postTitle} | ${profileName} on Pubky`;
        description = Utils.truncateText(firstParagraph, 100);
      } catch {
        // Fallback to default if parsing fails
      }
    }

    const metadata: Metadata = {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'article',
        images: image ? [image] : undefined
      },
      twitter: {
        card: image ? 'summary_large_image' : 'summary',
        title,
        description,
        images: image ? [image] : undefined
      }
    };

    return metadata;
  } catch (error) {
    console.error('Error generating post metadata:', error);
    return {
      title: '404 | Post',
      description: 'Post not found or an error occurred'
    };
  }
}

export default async function PostPage({ params }: Props) {
  return null;
}
