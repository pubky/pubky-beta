'use client';

import { z } from 'zod';
import { Button } from '@social/ui-shared';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getFile } from '@/services/fileService';
import { Links } from '@/types/Post';
import { usePubkyClientContext } from '@/contexts';
import { socialLinks } from '@/app/profile/components/Sidebar/_LinksSection';

interface FormErrors {
  [fieldName: string]: string[];
}

interface Errors {
  name: string;
  bio: string;
}

const profileSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  bio: z.string().min(3, { message: 'Short bio is required' }).optional(),
});

interface ButtonsProps {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setErrors: React.Dispatch<React.SetStateAction<Errors>>;
  bio: string;
  links: Links[];
  name: string;
  image: File | string | undefined;
  prevImage: File | string;
  status: string | undefined;
}

export default function Buttons({
  loading,
  setLoading,
  setErrors,
  bio,
  links,
  name,
  image,
  prevImage,
  status,
}: ButtonsProps) {
  const { saveProfile, deleteFile } = usePubkyClientContext();
  const router = useRouter();

  const handleSubmit = async () => {
    if (loading) {
      return;
    }
    try {
      setLoading(true);
      setErrors({
        name: '',
        bio: '',
      });
  
      const result = profileSchema.safeParse({
        name,
        bio: bio || undefined,
      });
  
      if (!result.success) {
        const newErrors: FormErrors = result.error.flatten().fieldErrors;
  
        const errorMessages = Object.keys(newErrors).reduce(
          (acc: { [key: string]: string }, key) => {
            acc[key] = newErrors[key].join(', ');
            return acc;
          },
          {}
        );
  
        setErrors((prev) => ({ ...prev, ...errorMessages }));
        setLoading(false);
        return;
      }
  
      const linksObject: { title: string; url: string }[] = [];
      const invalidLinkIndexes: number[] = [];
  
      links.forEach((link, index) => {
        if (link.url) {
          let validationResult;
          const cleanUrl = link.url.replace('mailto:', '');
  
          if (
            link.title.toLowerCase() === 'email' ||
            link.title.toLowerCase() === 'mail'
          ) {
            validationResult = z
              .string()
              .email({ message: 'Invalid email address' })
              .safeParse(cleanUrl);
  
            if (validationResult.success) {
              linksObject.push({
                title: link.title,
                url: `mailto:${cleanUrl}`,
              });
            } else {
              invalidLinkIndexes.push(index);
            }
          } else {
            validationResult = z
              .string()
              .url({ message: 'Invalid website URL' })
              .optional()
              .safeParse(link.url);
  
            if (!validationResult.success) {
              const socialLink = socialLinks.find(
                (social) => social.name.toLowerCase() === link.title.toLowerCase()
              );
  
              if (socialLink) {
                const completedUrl = `${socialLink.url}${link.url}`;
                validationResult = z
                  .string()
                  .url({ message: 'Invalid website URL' })
                  .safeParse(completedUrl);
  
                if (validationResult.success) {
                  linksObject.push({
                    title: link.title,
                    url: completedUrl,
                  });
                } else {
                  invalidLinkIndexes.push(index);
                }
              } else {
                invalidLinkIndexes.push(index);
              }
            } else {
              linksObject.push({
                title: link.title,
                url: link.url,
              });
            }
          }
        }
      });
  
      if (invalidLinkIndexes.length > 0) {
        const newErrors: FormErrors = {};
        invalidLinkIndexes.forEach((index) => {
          if (
            links[index].title.toLowerCase() === 'email' ||
            links[index].title.toLowerCase() === 'mail'
          ) {
            newErrors[`link${index}`] = ['Invalid email address'];
          } else {
            newErrors[`link${index}`] = ['Invalid website URL'];
          }
        });
        setErrors((prev) => ({ ...prev, ...newErrors }));
        setLoading(false);
        return;
      }
  
      await saveProfile({
        name,
        bio,
        image,
        links: linksObject,
        status: status,
      });
  
      if (
        prevImage &&
        prevImage !== '/images/webp/Userpic.webp' &&
        prevImage !== image
      ) {
        const { src } = await getFile(String(prevImage));
        await deleteFile(src);
        await deleteFile(String(prevImage));
      }
  
      router.push('/profile');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full max-w-[1200px] justify-between items-center inline-flex mt-6">
      <Link href="/onboarding/sign-up">
        <Button.Large
          id="edit-profile-cancel-btn"
          className="w-auto"
          variant="secondary"
          onClick={() => router.back()}
        >
          Cancel
        </Button.Large>
      </Link>
      <Button.Large
        id="edit-profile-save-btn"
        onClick={!loading ? () => handleSubmit() : undefined}
        loading={loading}
        className="w-auto z-20"
      >
        Save Profile
      </Button.Large>
    </div>
  );
}
