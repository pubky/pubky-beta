'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  Content,
  Button,
  Input,
  Card,
  Icon,
  Typography,
} from '@social/ui-shared';
import { Onboarding } from '../components';
import { useClientContext } from '../../../contexts/client';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import Link from 'next/link';
import { Modal } from '../../../components/Modal';
import { Utils } from '../../../utils';

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
    .max(140, { message: 'Maximum length 140 characters' })
    .optional(),
});

export default function Index() {
  const { signUp } = useClientContext();

  const router = useRouter();

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [image, setImage] = useState('/images/Userpic.png');
  const [showModalLink, setShowModalLink] = useState(false);
  const modalLinkRef = useRef<HTMLDivElement>(null);
  const [links, setLinks] = useState<
    { title: string; url: string; placeHolder?: string }[]
  >([
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

  const handleAddLink = (title: string, url: string) => {
    setLinks([...links, { title, url }]);
    setShowModalLink(false);
  };

  const handleRemoveLink = (indexToRemove: number) => {
    setLinks((prevLinks) => {
      const updatedLinks = prevLinks.filter(
        (_, index) => index !== indexToRemove
      );
      return updatedLinks;
    });
  };

  const UploadPic = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
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
          image,
          links: linksObject,
        });

        if (!signUpResponse) {
          throw new Error('Something went wrong');
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }

      router.push('/onboarding/pubky');
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadImage = () => {
    if (image === '/images/Userpic.png') {
      const fileInput = document.getElementById('fileInput');
      if (fileInput) {
        fileInput.click();
      }
    } else {
      setImage('/images/Userpic.png');
    }
  };

  const getButtonIconImage = () => {
    return image === '/images/Userpic.png' ? (
      <Icon.File size="16" />
    ) : (
      <Icon.Trash size="16" />
    );
  };

  const getButtonLabelImage = () => {
    return image === '/images/Userpic.png' ? 'Choose file' : undefined;
  };

  const getButtonWidthImage = () => {
    return image === '/images/Userpic.png' ? 'w-[154px]' : 'w-[60px]';
  };

  return (
    <Onboarding.Layout currentStep={2}>
      <Input.Cursor
        placeholder="Your Name"
        className="h-14 text-[40px] font-bold sm:h-[174px] sm:text-[100px] -mt-[50px]"
        defaultValue={name ? name : ''}
        autoFocus
        id="onboarding-name-input"
        autoCorrect="off"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setName(e.target.value)
        }
        error={errors.name}
      />
      <Typography.PageTitle className="text-opacity-50 mt-4 sm:mt-0">
        Enter your bio, add some links, and upload a user picture.
      </Typography.PageTitle>
      <div className="w-full flex-col inline-flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        <Card.Primary className="justify-start gap-4" title="Profile">
          <div>
            <Input.Label value="Short bio" />
            <Card.Primary
              background="bg-white bg-opacity-10"
              className="border border-white border-opacity-10 shadow-[0_4px_8px_0_rgba(0,0,0,0.32)_inset] rounded-lg mt-2"
            >
              <Input.TextArea
                placeholder="Short bio. Tell a bit about yourself."
                className="h-[240px]"
                id="onboarding-bio-input"
                defaultValue={bio ? bio : ''}
                error={errors.bio}
                onInput={(e: React.FormEvent<HTMLTextAreaElement>) => {
                  const target = e.target as HTMLTextAreaElement;
                  if (Utils.isValidContent(target.value)) {
                    const cleanedBio = Utils.cleanText(target.value);
                    setBio(cleanedBio);
                  } else {
                    setBio('');
                  }
                }}
              />
            </Card.Primary>
          </div>
        </Card.Primary>
        <Card.Primary className="justify-start" title="Links">
          <div className="flex-col inline-flex gap-4 mt-4">
            {links.map((link, index) => (
              <div key={index}>
                <Input.Label value={link.title} />
                <Input.Text
                  className="h-[70px] mt-2"
                  placeholder={link.placeHolder}
                  value={link.url}
                  error={errors[`link${index}` as keyof typeof errors]}
                  action={
                    index > 1 && (
                      <div
                        className="mt-3 cursor-pointer"
                        onClick={() => handleRemoveLink(index)}
                      >
                        <Icon.Trash color="gray" />
                      </div>
                    )
                  }
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const updatedLinks = [...links];
                    updatedLinks[index].url = e.target.value;
                    setLinks(updatedLinks);
                  }}
                />
              </div>
            ))}
            <Button.Transparent
              className="w-[40%] mt-2"
              icon={
                <Icon.LinkSimple
                  size="16"
                  color={links.length > 4 ? 'gray' : 'white'}
                />
              }
              onClick={
                links.length > 4 ? undefined : () => setShowModalLink(true)
              }
              disabled={links.length > 4}
            >
              Add link
            </Button.Transparent>
          </div>
        </Card.Primary>
        <Card.Primary className="justify-start z-10" title="Picture">
          {image && (
            <div className="relative">
              <Image
                width={150}
                height={150}
                className="w-80 h-80 mt-12 rounded-full"
                alt="user"
                src={image}
              />
              <Button.Transparent
                icon={getButtonIconImage()}
                onClick={handleUploadImage}
                className={`${getButtonWidthImage()} mt-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}
              >
                {getButtonLabelImage()}
              </Button.Transparent>
            </div>
          )}
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            onChange={UploadPic}
            className="hidden"
          />
        </Card.Primary>
        <Content.MainBg alt="Onboard Pubky" imgSrc="/images/bg-image-2.png" />
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
