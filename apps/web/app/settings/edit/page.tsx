'use client';

import Image from 'next/image';
import Link from 'next/link';
import { z } from 'zod';
import { useEffect, useRef, useState } from 'react';
import {
  Content,
  Typography,
  Button,
  Input,
  Card,
  Icon,
} from '@social/ui-shared';
import { Header } from '@/components';
import { useClientContext } from '@/contexts';
import { Utils } from '@social/utils-shared';
import { useRouter } from 'next/navigation';
import { Modal } from '@/components/Modal';

interface FormErrors {
  [fieldName: string]: string[];
}

const profileSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  bio: z.string().min(3, { message: 'Short bio is required' }).optional(),
});

export default function Index() {
  const router = useRouter();
  const { pubky, saveProfile, getProfile } = useClientContext();

  const [handler, setHandler] = useState('Loading...');
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [image, setImage] = useState('/images/Userpic.png');
  const [showModalLink, setShowModalLink] = useState(false);
  const modalLinkRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [links, setLinks] = useState<
    { title: string; url: string; placeHolder?: string }[]
  >([
    { url: '', title: 'website', placeHolder: 'https://' },
    { url: '', title: 'email', placeHolder: 'user@provider.com' },
  ]);
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
    setHandler(Utils.minifyPubky(pubky));
    async function fetchData() {
      try {
        const userProfile = await getProfile();

        if (userProfile) {
          setName(userProfile.name);
          setBio(userProfile.bio);
          setImage(userProfile.image || '/images/Userpic.png');
          if (userProfile.links.length > 0) setLinks(userProfile.links);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [pubky, getProfile]);

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

      const linksObject: { [fieldName: string]: string } = {};
      const invalidLinkIndexes: number[] = [];

      links.forEach((link, index) => {
        if (link.url) {
          let validationResult;
          if (
            link.title.toLowerCase() === 'email' ||
            link.title.toLowerCase() === 'mail'
          ) {
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
          if (links[index].title === 'email' || links[index].title === 'mail') {
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

      router.push('/profile');
    } catch (error) {
      console.log(error);
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
    <Content.Main>
      <Header
        className="hidden w-[400px] xl:w-[260px] md:block"
        title="Settings"
      />
      <Content.Grid>
        <Input.Cursor
          placeholder="Your Name"
          className="h-auto text-[40px] font-bold sm:text-[64px]"
          defaultValue={name}
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
          {handler}
        </Typography.H2>
        <div className="w-full flex-col inline-flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          <Card.Primary className="justify-start gap-4" title="Profile">
            <div>
              <Input.Label value="Short bio" />
              <Card.Primary
                background="bg-transparent"
                className="border border-white border-opacity-30 border-dashed mt-2"
              >
                <Input.TextArea
                  placeholder="Short bio. Tell a bit about yourself."
                  className="h-[240px]"
                  maxLength={160}
                  defaultValue={bio}
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
                      <div
                        className={`${
                          errors[`link${index}` as keyof typeof errors]
                            ? 'mt-0'
                            : 'mt-2'
                        } cursor-pointer`}
                        onClick={() => handleRemoveLink(index)}
                      >
                        <Icon.Trash color="gray" />
                      </div>
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
                disabled={links.length > 3}
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
        <div className="w-full max-w-[1200px] justify-between items-center inline-flex mt-12">
          <Link href="/onboarding/sign-up">
            <Button.Large
              className="w-auto"
              variant="secondary"
              onClick={() => router.back()}
            >
              Cancel
            </Button.Large>
          </Link>
          <Button.Large
            onClick={!loading ? () => handleSubmit() : undefined}
            loading={loading}
            className="w-auto z-20"
          >
            Save Profile
          </Button.Large>
        </div>
      </Content.Grid>
      <Modal.Link
        showModalLink={showModalLink}
        setShowModalLink={setShowModalLink}
        modalLinkRef={modalLinkRef}
        onAddLink={handleAddLink}
      />
    </Content.Main>
  );
}
