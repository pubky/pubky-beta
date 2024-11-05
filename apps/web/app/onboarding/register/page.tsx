'use client';

import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Button, Input, Icon, Typography } from '@social/ui-shared';
import { Modal } from '@/components/Modal';
import { Onboarding } from '../components';
import { Card } from './Card';
import { useAlertContext, usePubkyClientContext } from '@/contexts';
import { Links } from '@/types/Post';
import { Utils } from '@social/utils-shared';

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
  const { pubky, saveProfile } = usePubkyClientContext();
  const { setContent, setShow } = useAlertContext();

  const router = useRouter();

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [image, setImage] = useState<File | string>('/images/Userpic.png');
  const [showModalLink, setShowModalLink] = useState(false);
  const modalLinkRef = useRef<HTMLDivElement>(null);
  const [links, setLinks] = useState<Links[]>([
    { url: '', title: 'website', placeHolder: 'https://' },
    { url: '', title: 'email', placeHolder: 'user@provider.com' },
  ]);
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

  useEffect(() => {
    setContent('Add info, your profile is empty.', 'warning');
    setShow(true);
  }, [pubky]);

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
        const linksObject: Links[] = [];
        const invalidLinkIndexes: number[] = [];

        links.forEach((link, index) => {
          if (link.url) {
            let validationResult;
            const cleanUrl = link.url.replace('mailto:', '');

            if (link.title === 'email') {
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
            }

            if (validationResult.success) {
              linksObject.push({
                title: link.title,
                url: link.url,
              });
            } else {
              invalidLinkIndexes.push(index);
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
        });
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }

      router.push('/home');
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <Onboarding.Layout currentStep={3}>
      <Input.Cursor
        placeholder="Your Name"
        className="h-auto text-[40px] font-bold sm:text-[64px]"
        defaultValue={name}
        disabled={loading}
        maxLength={25}
        autoCorrect="off"
        error={errors.name}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setName(e.target.value)
        }
      />
      <Typography.H2
        variant="light"
        className="-mt-4 text-opacity-50 break-words"
      >
        {Utils.minifyPubky(pubky ?? '')}
      </Typography.H2>
      <div className="w-full flex-col inline-flex sm:grid sm:grid-cols-2 lg:grid-cols-8 gap-6 mt-6">
        <Card.Bio bio={bio} setBio={setBio} errors={errors} />
        <Card.Links
          links={links}
          setLinks={setLinks}
          setShowModalLink={setShowModalLink}
          errors={errors}
        />
        <Card.Pic image={image} setImage={setImage} />
      </div>
      <div className="w-full max-w-[1200px] mt-6 justify-end items-center inline-flex">
        <Button.Large
          onClick={!loading ? () => handleSubmit() : undefined}
          icon={<Icon.Check />}
          className="w-[140px]"
          loading={loading}
          id="onboarding-submit-button"
        >
          Finish
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
