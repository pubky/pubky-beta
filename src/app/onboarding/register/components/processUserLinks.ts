import { z } from 'zod';
import { socialLinks } from '@/app/profile/components/Sidebar/_LinksSection';
import { PubkyAppUserLink } from 'pubky-app-specs';
import { Links } from '@/types/Post';

export function processUserLinks(links: Links[]) {
  const userLinks: PubkyAppUserLink[] = [];
  const errors: Array<{ index: number; message: string }> = [];

  const emailSchema = z.string().email();
  const urlSchema = z.string().url();

  links.forEach((link, index) => {
    if (!link.url) return; // Skip empty URLs

    let url = link.url;
    let errorMessage: string | null = null;
    const titleLower = link.title.toLowerCase();

    // Handle email links
    if (titleLower === 'email' || titleLower === 'mail') {
      const cleanUrl = url.replace(/^mailto:/, '');
      const result = emailSchema.safeParse(cleanUrl);
      if (!result.success) {
        errorMessage = 'Invalid email address';
      } else {
        url = `mailto:${cleanUrl}`;
      }
    }
    // Handle other links
    else {
      const urlResult = urlSchema.safeParse(url);
      if (!urlResult.success) {
        const socialLink = socialLinks.find((s) => s.name.toLowerCase() === titleLower);
        if (socialLink) {
          const completedUrl = `${socialLink.url}${url}`;
          const completedResult = urlSchema.safeParse(completedUrl);
          if (completedResult.success) {
            url = completedUrl;
          } else {
            errorMessage = 'Invalid website URL';
          }
        } else {
          errorMessage = 'Invalid website URL';
        }
      }
    }

    if (errorMessage) {
      errors.push({ index, message: errorMessage });
    } else {
      userLinks.push(new PubkyAppUserLink(link.title, url));
    }
  });

  return { userLinks, errors };
}
