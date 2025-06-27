'use client';

import { z } from 'zod';
import { Button } from '@social/ui-shared';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getFile } from '@/services/fileService';
import { Links } from '@/types/Post';
import { usePubkyClientContext } from '@/contexts';
import { processUserLinks } from '@/app/onboarding/register/components/processUserLinks';
import { avatarCache } from '@/components/utils-shared/lib/Helper/avatarCache';

interface FormErrors {
  [fieldName: string]: string[];
}

interface Errors {
  name: string;
  bio: string;
}

const profileSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  bio: z.string().min(3, { message: 'Short bio is required' }).optional()
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
  status
}: ButtonsProps) {
  const { saveProfile, deleteFile, pubky } = usePubkyClientContext();
  const router = useRouter();

  const handleSubmit = async () => {
    if (loading) {
      return;
    }
    try {
      setLoading(true);
      setErrors({
        name: '',
        bio: ''
      });

      const result = profileSchema.safeParse({
        name,
        bio: bio || undefined
      });

      if (!result.success) {
        const newErrors: FormErrors = result.error.flatten().fieldErrors;

        const errorMessages = Object.keys(newErrors).reduce((acc: { [key: string]: string }, key) => {
          acc[key] = newErrors[key].join(', ');
          return acc;
        }, {});

        setErrors((prev) => ({ ...prev, ...errorMessages }));
        setLoading(false);
        return;
      }

      const { userLinks: linksObject, errors: linkErrors } = processUserLinks(links);

      if (linkErrors.length > 0) {
        const newErrors: FormErrors = {};
        linkErrors.forEach(({ index, message }) => {
          newErrors[`link${index}`] = [message];
        });
        setErrors((prev) => ({ ...prev, ...newErrors }));
        setLoading(false);
        return;
      }

      await saveProfile(name, bio, image, linksObject, status);

      // clean prevImage in avatarCache
      avatarCache.delete(pubky);

      if (prevImage && prevImage !== image) {
        const { src } = await getFile(String(prevImage));
        await deleteFile(src);
        await deleteFile(String(prevImage));
      }

      // If a new image was uploaded and there was no previous image, wait 2 seconds for indexing
      const isNewImageUploaded = image instanceof File;
      const hadPreviousImage = prevImage && prevImage !== '';

      if (isNewImageUploaded && !hadPreviousImage) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }

      router.push('/profile');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full max-w-[1200px] justify-between items-center inline-flex mt-6">
      <Link href="/onboarding/sign-up">
        <Button.Large id="edit-profile-cancel-btn" className="w-auto" variant="secondary" onClick={() => router.back()}>
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
