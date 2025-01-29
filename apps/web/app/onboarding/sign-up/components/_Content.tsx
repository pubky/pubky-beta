'use client';

import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Button, Input, Icon, Typography } from '@social/ui-shared';
import { usePubkyClientContext } from '@/contexts';
import { Modal } from '@/components/Modal';
import { Onboarding } from '../../components';
import { Card } from '../Card';
import { Links } from '@/types/Post';
import { BottomSheet } from '@/components';
import genJdenticon from 'libs/utils-shared/src/lib/Helper/genJdenticon';
import { processUserLinks } from '../../register/components/processUserLinks';

interface FormErrors {
  [fieldName: string]: string[];
}

const profileSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Minimum length 3 character.' })
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
  const [image, setImage] = useState<File | string | undefined>();
  const [generatedImage, setGeneratedImage] = useState<File>();
  const [showModalLink, setShowModalLink] = useState(false);
  const [showSheetLink, setShowSheetLink] = useState(false);
  const modalLinkRef = useRef<HTMLDivElement>(null);
  const [links, setLinks] = useState<Links[]>([
    { url: '', title: 'website', placeHolder: 'https://' },
    { url: '', title: 'x (twitter)', placeHolder: '@user' },
  ]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    bio: '',
  });

  useEffect(() => {
    const generateAndSetImage = async () => {
      if (!profile?.image && !image) {
        const id = Math.random().toString(36).substring(2, 15);
        const generatedImage = await genJdenticon(id);
        setGeneratedImage(generatedImage);
        setImage(generatedImage);
      }
    };

    generateAndSetImage();
  }, [profile?.image, image]);

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
    setShowSheetLink(false);
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
          {},
        );

        setErrors((prev) => ({ ...prev, ...errorMessages }));
        setLoading(false);
        return;
      }

      try {
        const { userLinks: linksObject, errors: linkErrors } =
          processUserLinks(links);

        if (linkErrors.length > 0) {
          const newErrors: FormErrors = {};
          linkErrors.forEach(({ index, message }) => {
            newErrors[`link${index}`] = [message];
          });
          setErrors((prev) => ({ ...prev, ...newErrors }));
          setLoading(false);
          return;
        }

        const signUpResponse = await signUp(name, bio, linksObject, image);

        if (!signUpResponse) {
          throw new Error('Something went wrong');
        }
        router.push('/onboarding/pubky');
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <Onboarding.Layout currentStep={2}>
      <Input.Cursor
        placeholder="Your Name"
        className="h-14 text-[40px] font-bold sm:h-[106px] sm:text-[64px] placeholder:text-opacity-20"
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
      <Typography.Body
        variant="large"
        className="text-[22px] sm:text-2xl leading-tight text-opacity-50 mt-2 sm:mt-0"
      >
        Enter your bio, add some links, and upload a user picture.
      </Typography.Body>
      <div className="w-full flex-col inline-flex sm:grid sm:grid-cols-2 lg:grid-cols-8 gap-6 mt-6">
        <Card.Bio bio={bio} setBio={setBio} errors={errors} loading={loading} />
        <Card.Links
          links={links}
          setLinks={setLinks}
          setShowModalLink={setShowModalLink}
          setShowSheetLink={setShowSheetLink}
          errors={errors}
          loading={loading}
        />
        <Card.Pic
          image={image}
          setImage={setImage}
          loading={loading}
          defaultImage={generatedImage}
        />
        {/**<Content.MainBg alt="Onboard Pubky" imgSrc="/images/webp/bg-image-2.webp" />*/}
      </div>
      <div className="w-full max-w-[1200px] mt-6 justify-between items-center inline-flex">
        <Link href="/onboarding/sign-in">
          <Button.Large
            icon={<Icon.ArrowLeft />}
            className="w-auto"
            variant="secondary"
          >
            Back
          </Button.Large>
        </Link>
        <Button.Large
          onClick={!loading ? () => handleSubmit() : undefined}
          icon={<Icon.ArrowRight />}
          className="w-auto"
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
      <BottomSheet.Link
        show={showSheetLink}
        setShow={setShowSheetLink}
        onAddLink={handleAddLink}
      />
    </Onboarding.Layout>
  );
}
