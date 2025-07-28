import { getSeoMetadata } from '@/components/HeaderSEO';
import { getPost } from '@/services/postService';
import { getUserDetails } from '@/services/userService';
import { getFile } from '@/services/fileService';
import { Utils } from '@social/utils-shared';
import { PubkyAppPostKind } from 'pubky-app-specs';

const NEXT_PUBLIC_NEXUS = process.env.NEXT_PUBLIC_NEXUS;
const BASE_URL = `${NEXT_PUBLIC_NEXUS}`;

type Props = {
  params: Promise<{ pubky: string; postId: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { pubky, postId } = await params;

  try {
    // Fetch post data for SEO
    const post = await getPost(pubky, postId, '');

    if (!post) {
      return getSeoMetadata({
        title: 'Post not found | Pubky.app',
        description: 'The requested post could not be found.'
      });
    }

    // Get user details for author information
    let authorName = Utils.minifyPubky(pubky);
    let authorImage = '';

    try {
      const userDetails = await getUserDetails(pubky);
      authorName = userDetails.name || Utils.minifyPubky(pubky);

      if (userDetails.image && userDetails.image !== 'null') {
        const profilePic = await getFile(userDetails.image);
        authorImage = `${BASE_URL}/static/files/${JSON.parse(profilePic?.urls).main}`;
      }
    } catch (error) {
      console.log('Error fetching user details for SEO:', error);
    }

    // Determine title and description based on post type
    let title = '';
    let description = '';
    let image = authorImage;

    if (String(post.details?.kind) === PubkyAppPostKind[1].toLocaleLowerCase()) {
      // Long post (article)
      try {
        const content = JSON.parse(post.details?.content);
        title = `${content.title} | ${authorName} on Pubky`;
        description = Utils.truncateText(content.body.replace(/<[^>]*>/g, ''), 160);

        // Use article image if available
        if (post.details?.attachments?.length > 0 && post.details.attachments[0]) {
          try {
            const articleImage = await getFile(post.details.attachments[0]);
            image = `${BASE_URL}/static/files/${JSON.parse(articleImage?.urls).main}`;
          } catch (error) {
            console.log('Error fetching article image for SEO:', error);
          }
        }
      } catch (error) {
        title = `${authorName} on Pubky`;
        description = Utils.truncateText(post.details?.content || '', 160);
      }
    } else {
      // Regular post
      title = `${authorName} on Pubky`;
      description = Utils.truncateText(post.details?.content || '', 160);

      // Use post image if available
      if (post.details?.attachments?.length > 0 && post.details.attachments[0]) {
        try {
          const postImage = await getFile(post.details.attachments[0]);
          image = `${BASE_URL}/static/files/${JSON.parse(postImage?.urls).main}`;
        } catch (error) {
          console.log('Error fetching post image for SEO:', error);
        }
      }
    }

    return getSeoMetadata({
      title,
      description,
      image: image || undefined,
      url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://pubky.app'}/post/${pubky}/${postId}`
    });
  } catch (error) {
    console.error('Error generating metadata for post:', error);
    return getSeoMetadata({
      title: 'Poost not found | Pubky.app',
      description: 'The requested post could not be found.'
    });
  }
}

export default async function PostPage() {
  return null;
}
