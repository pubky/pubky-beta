'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Utils } from '@social/utils-shared';
import { getPost } from '@/services/postService';
import { getFile } from '@/services/fileService';
import { getUserDetails } from '@/services/userService';
import { PubkyAppPostKind } from 'pubky-app-specs';
import { usePubkyClientContext } from '@/contexts';

const NEXT_PUBLIC_NEXUS = process.env.NEXT_PUBLIC_NEXUS;
const BASE_URL = `${NEXT_PUBLIC_NEXUS}`;

export function PostSEO() {
  const pathname = usePathname();
  const { pubky } = usePubkyClientContext();

  useEffect(() => {
    const updatePostSEO = async () => {
      // Check if pathname matches post URL pattern: /post/[pubky]/[postId]
      const postUrlMatch = pathname.match(/^\/post\/([^\/]+)\/([^\/]+)$/);
      
      if (!postUrlMatch) return;

      const [, pubkyParam, postIdParam] = postUrlMatch;

      try {
        // Fetch the post data
        const post = await getPost(pubkyParam, postIdParam, pubky ?? '');
        
        if (!post) return;

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

        // Update meta tags
        const updateMetaTag = (name: string, content: string) => {
          let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
          if (!meta) {
            meta = document.createElement('meta');
            meta.name = name;
            document.head.appendChild(meta);
          }
          meta.content = content;
        };

        const updateOGTag = (property: string, content: string) => {
          let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
          if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute('property', property);
            document.head.appendChild(meta);
          }
          meta.content = content;
        };

        // Update title
        document.title = title;

        // Update meta description
        updateMetaTag('description', description);

        // Update Open Graph tags
        updateOGTag('og:title', title);
        updateOGTag('og:description', description);
        updateOGTag('og:url', window.location.href);
        updateOGTag('og:type', 'article');
        
        if (image) {
          updateOGTag('og:image', image);
        }

        // Update Twitter tags
        updateOGTag('twitter:title', title);
        updateOGTag('twitter:description', description);
        updateOGTag('twitter:card', image ? 'summary_large_image' : 'summary');
        
        if (image) {
          updateOGTag('twitter:image', image);
        }

      } catch (error) {
        console.error('Error updating post SEO:', error);
      }
    };

    updatePostSEO();
  }, [pathname, pubky]);

  return null;
} 