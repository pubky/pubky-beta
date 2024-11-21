'use client';

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
import { useAlertContext, usePubkyClientContext } from '@/contexts';
import { Utils } from '@social/utils-shared';
import * as jdenticon from 'jdenticon';
import { useRouter } from 'next/navigation';
import { Modal } from '@/components/Modal';
import { ImageByUri } from '@/components/ImageByUri';
import { useUserProfile } from '@/hooks/useUser';
import { Links } from '@/types/Post';

interface FormErrors {
  [fieldName: string]: string[];
}

const profileSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  bio: z.string().min(3, { message: 'Short bio is required' }).optional(),
});

export default function Index() {
  const router = useRouter();
  const { pubky, profile, saveProfile, deleteFile } = usePubkyClientContext();
  const { data: profileUser } = useUserProfile(pubky ?? '', pubky ?? '');
  const { setContent, setShow } = useAlertContext();
  const [handler, setHandler] = useState(pubky);
  const [name, setName] = useState('');
  const [showModalCroppedImage, setShowModalCroppedImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [image, setImage] = useState<File | string | undefined>(profile?.image);
  const [generatedImage, setGeneratedImage] = useState<File | string>();
  const [bio, setBio] = useState('');
  const [prevImage, setPrevImage] = useState<File | string>('');
  const [showModalLink, setShowModalLink] = useState(false);
  const modalLinkRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [links, setLinks] = useState<Links[]>([
    { url: '', title: 'website', placeHolder: 'https://' },
    { url: '', title: 'x (twitter)', placeHolder: '@user' },
  ]);
  const [errors, setErrors] = useState({
    name: '',
    bio: '',
  });

  useEffect(() => {
    if (!image) {
      const fetchJdenticon = async () => {
        const id = pubky ?? Math.random().toString(36).substring(2, 15);
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
    } else if (image === profile?.image) {
      setGeneratedImage(profile?.image);
      setImage(profile?.image);
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

  useEffect(() => {
    if (!pubky) return;

    setHandler(Utils.minifyPubky(pubky));

    async function fetchData() {
      try {
        const userProfile = profileUser;

        if (userProfile) {
          setName(userProfile?.details?.name);
          setBio(userProfile?.details?.bio || '');
          setImage(userProfile?.details?.image || '/images/webp/Userpic.webp');
          setPrevImage(
            userProfile?.details?.image || '/images/webp/Userpic.webp'
          );
          if (
            userProfile?.details?.links &&
            userProfile?.details?.links?.length > 0
          )
            setLinks(userProfile?.details?.links);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pubky, profile]);

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
    const maxSizeInMB = 20;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    const file = event.target.files?.[0];

    if (file) {
      if (file.size > maxSizeInBytes) {
        setContent('The maximum allowed size is 20 MB', 'warning');
        setShow(true);
        return;
      }

      const img = new Image();
      const newImageUrl = URL.createObjectURL(file);
      img.src = newImageUrl;

      img.onload = () => {
        setSelectedImage(img.src);
        setShowModalCroppedImage(true);
      };
      event.target.value = '';
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

            if (validationResult.success) {
              linksObject.push({
                title: link.title,
                url: link.url,
              });
            } else {
              invalidLinkIndexes.push(index);
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
        status: profileUser?.details?.status,
      });

      if (
        prevImage &&
        prevImage !== '/images/webp/Userpic.webp' &&
        prevImage !== image
      ) {
        await deleteFile(String(prevImage));
      }

      router.push('/profile');
    } catch (error) {
      console.log(error);
    }
  };

  const handleUploadImage = () => {
    if (image === generatedImage) {
      const fileInput = document.getElementById('fileInput');
      if (fileInput) {
        fileInput.click();
      }
    } else {
      generatedImage && setImage(generatedImage);
      setSelectedImage(null);
    }
  };

  const getButtonIconImage = () => {
    return image === generatedImage ? (
      <div>
        <Icon.File size="16" />
      </div>
    ) : (
      <div>
        <Icon.Trash size="16" />
      </div>
    );
  };

  const getButtonLabelImage = () => {
    return image === generatedImage ? 'Choose file' : undefined;
  };

  const getButtonWidthImage = () => {
    return image === generatedImage
      ? 'w-[120px] lg:w-[85%] xl:w-8/12'
      : 'w-[38px] h-[38px]';
  };

  return (
    <Content.Main>
      <Header className="hidden md:block" title="Settings" />
      <Content.Grid>
        <Input.Cursor
          id="edit-profile-name-input"
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
          {handler}
        </Typography.H2>
        <div className="w-full flex-col inline-flex sm:grid sm:grid-cols-2 lg:grid-cols-8 gap-6 mt-6">
          <Card.Primary
            className="justify-start gap-4 w-full col-span-3"
            title="Profile"
          >
            <div>
              <Input.Label value="Short bio" />
              <Card.Primary
                background="bg-transparent"
                className="border border-white border-opacity-30 border-dashed mt-2"
              >
                <Input.TextArea
                  id="edit-profile-bio-input"
                  placeholder="Short bio. Tell a bit about yourself."
                  className="h-[180px]"
                  disabled={loading}
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
          <Card.Primary
            className="justify-start w-full col-span-3"
            title="Links"
          >
            <div className="flex-col inline-flex gap-4 mt-4">
              {links.map((link, index) => (
                <div key={index}>
                  <Input.Label value={link.title} />
                  <Input.Text
                    id={`edit-profile-link-${link.title.toLowerCase()}-input`}
                    className="h-[70px] mt-2"
                    placeholder={link.placeHolder}
                    disabled={loading}
                    value={link.url.replace('mailto:', '')}
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
                id="edit-profile-add-link-btn"
                className="w-[100px] mt-2 px-3 py-2 h-8"
                icon={
                  <Icon.LinkSimple
                    size="16"
                    color={links.length > 3 ? 'gray' : 'white'}
                  />
                }
                onClick={
                  links.length > 3 ? undefined : () => setShowModalLink(true)
                }
                disabled={links.length > 3}
              >
                Add link
              </Button.Transparent>
            </div>
          </Card.Primary>
          <Card.Primary
            className="justify-start z-10 w-full col-span-2"
            title="Picture"
          >
            {image && (
              <div className="relative flex items-center justify-center">
                <ImageByUri
                  width={100}
                  height={100}
                  className="w-72 h-72 lg:w-36 lg:h-36 xl:w-52 xl:h-52 mt-[20px] lg:mt-[50px] rounded-full"
                  alt="user"
                  uri={image}
                />
                <Button.Transparent
                  icon={getButtonIconImage()}
                  onClick={handleUploadImage}
                  className={`${getButtonWidthImage()} mt-2 md:mt-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}
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
              disabled={loading}
            />
          </Card.Primary>
          {/**<Content.MainBg alt="Onboard Pubky" imgSrc="/images/webp/bg-image-2.webp" />*/}
        </div>
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
      </Content.Grid>
      <Modal.Link
        showModalLink={showModalLink}
        setShowModalLink={setShowModalLink}
        modalLinkRef={modalLinkRef}
        onAddLink={handleAddLink}
      />
      {showModalCroppedImage && selectedImage && (
        <Modal.CroppedImage
          showModalCroppedImage={showModalCroppedImage}
          setShowModalCroppedImage={setShowModalCroppedImage}
          image={selectedImage}
          setImage={setImage}
        />
      )}
    </Content.Main>
  );
}
