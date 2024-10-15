'use client';

import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Button, Input, Icon, Typography } from '@social/ui-shared';
import { usePubkyClientContext } from '@/contexts';
import { Modal } from '@/components/Modal';
import { Onboarding } from '../components';
import { Card } from './Card';

interface FormErrors {
  [fieldName: string]: string[];
}

const profileSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Minimum length 1 character.' })
    .max(24, { message: 'Maximum length 24 characters' }),
  bio: z
    .string()
    .max(160, { message: 'Maximum length 160 characters' })
    .optional(),
});

export default function Index() {
  const { signUp, profile } = usePubkyClientContext();
  const router = useRouter();

  const [name, setName] = useState(profile?.name || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [image, setImage] = useState<File | string>(
    profile?.image || '/images/Userpic.png'
  );
  const [showModalLink, setShowModalLink] = useState(false);
  const modalLinkRef = useRef<HTMLDivElement>(null);
  const [links, setLinks] = useState<
    { title: string; url: string; placeHolder?: string }[]
  >(
    profile?.links || [
      { url: '', title: 'website', placeHolder: 'https://' },
      { url: '', title: 'email', placeHolder: 'user@provider.com' },
    ]
  );
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    bio: '',
  });

  useEffect(() => {
    const handleClickOutsideModal = (event: MouseEvent) => {
      if (
        modalLinkRef.current &&
        !modalLinkRef.current.contains(event.target as Node)
      ) {
        setShowModalLink(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutsideModal);

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideModal);
    };
  }, [modalLinkRef, setShowModalLink]);

  const handleAddLink = (title: string, url: string) => {
    setLinks([...links, { title, url }]);
    setShowModalLink(false);
  };

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
        name: name,
        bio: bio ? bio : undefined,
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
        return;
      }

      try {
        const linksObject: { [fieldName: string]: string } = {};
        const invalidLinkIndexes: number[] = [];

        links.forEach((link, index) => {
          if (link.url) {
            let validationResult;
            if (link.title === 'email') {
              validationResult = z
                .string()
                .email({ message: 'Invalid email address' })
                .safeParse(link.url);
            } else {
              validationResult = z
                .string()
                .url({ message: 'Invalid website URL' })
                .optional()
                .safeParse(link.url);
            }

            if (!validationResult.success) {
              invalidLinkIndexes.push(index);
            } else {
              linksObject[link.title] = link.url;
            }
          }
        });

        if (invalidLinkIndexes.length > 0) {
          const newErrors: FormErrors = {};
          invalidLinkIndexes.forEach((index) => {
            if (links[index].title === 'email') {
              newErrors[`link${index}`] = ['Invalid email address'];
            } else {
              newErrors[`link${index}`] = ['Invalid website URL'];
            }
          });
          setErrors((prev) => ({ ...prev, ...newErrors }));
          setLoading(false);
          return;
        }

        const signUpResponse = await signUp({
          name,
          bio,
          image: image instanceof File ? image : undefined,
          links: linksObject ? linksObject : undefined,
        });

        if (!signUpResponse) {
          throw new Error('Something went wrong');
        }
      } catch (error) {
        console.log(error);
      } finally {
        router.push('/onboarding/pubky');
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Onboarding.Layout currentStep={2}>
      <Input.Cursor
        placeholder="Your Name"
        className="h-14 text-[40px] font-bold sm:h-[106px] sm:text-[64px]"
        defaultValue={name ? name : ''}
        disabled={loading}
        autoFocus
        id="onboarding-name-input"
        autoCorrect="off"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setName(e.target.value)
        }
        error={errors.name}
      />
      <Typography.H2 variant="light" className="text-opacity-50 mt-4 sm:mt-0">
        Enter your bio, add some links, and upload a user picture.
      </Typography.H2>
      <div className="w-full flex-col inline-flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        <Card.Bio bio={bio} setBio={setBio} errors={errors} loading={loading} />
        <Card.Links
          links={links}
          setLinks={setLinks}
          setShowModalLink={setShowModalLink}
          errors={errors}
          loading={loading}
        />
        <Card.Pic image={image} setImage={setImage} loading={loading} />
        {/**<Content.MainBg alt="Onboard Pubky" imgSrc="/images/bg-image-2.png" />*/}
      </div>
      <div className="w-full max-w-[1200px] mt-6 justify-between items-center inline-flex">
        <Link href="/onboarding/sign-in">
          <Button.Large
            icon={<Icon.ArrowLeft />}
            className="w-[140px]"
            variant="secondary"
          >
            Back
          </Button.Large>
        </Link>
        <Button.Large
          onClick={!loading ? () => handleSubmit() : undefined}
          icon={<Icon.ArrowRight />}
          className="w-[140px]"
          loading={loading}
          id="onboarding-submit-button"
        >
          Continue
        </Button.Large>
      </div>
      <Modal.Link
        showModalLink={showModalLink}
        setShowModalLink={setShowModalLink}
        modalLinkRef={modalLinkRef}
        onAddLink={handleAddLink}
      />
    </Onboarding.Layout>
  );
}
