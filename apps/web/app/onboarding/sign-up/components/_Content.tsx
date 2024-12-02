'use client';

import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Button, Input, Icon, Typography } from '@social/ui-shared';
import { usePubkyClientContext } from '@/contexts';
import * as jdenticon from 'jdenticon';
import { Modal } from '@/components/Modal';
import { Onboarding } from '../../components';
import { Card } from '../Card';
import { Links } from '@/types/Post';
import { Utils } from '@social/utils-shared';
import { socialLinks } from '@/app/profile/components/Sidebar/_LinksSection';

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
  const [image, setImage] = useState<File | string | undefined>('');
  const [generatedImage, setGeneratedImage] = useState<File>();
  const [showModalLink, setShowModalLink] = useState(false);
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
    if (!profile?.image && !image) {
      const fetchJdenticon = async () => {
        const id = Math.random().toString(36).substring(2, 15);
        const size = 200;
        const svgCode = jdenticon.toSvg(id, size);

        try {
          const pngBlob = await Utils.svgToPng(svgCode, size);
          const pngFile = new File([pngBlob], `${id}.png`, {
            type: 'image/png',
          });

          setGeneratedImage(pngFile);
          setImage(pngFile);
        } catch (error) {
          console.error('Error converting SVG to PNG:', error);
        }
      };

      fetchJdenticon();
    }
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
    </Onboarding.Layout>
  );
}
