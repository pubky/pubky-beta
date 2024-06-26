'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  Content,
  Typography,
  Button,
  Input,
  Card,
  Icon,
  Tooltip,
} from '@social/ui-shared';
import { Header } from '../../components';
import { useClientContext } from '../../contexts/client';
import { Utils } from '../../utils';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { Modal } from '../../components/Modal';
import Link from 'next/link';

interface FormErrors {
  [fieldName: string]: string[];
}

const profileSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  bio: z.string().min(3, { message: 'Short bio is required' }).optional(),
});

const passwordSchema = z.object({
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' }),
});

export default function Index() {
  const router = useRouter();
  const { pubky, seed, setSeed, saveProfile, getProfile, getRecoveryFile } =
    useClientContext();

  const [disposableAccount, setDisposableAccount] = useState(false);

  const [handler, setHandler] = useState('Loading...');
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [image, setImage] = useState('/images/Userpic.png');
  const [showModalLink, setShowModalLink] = useState(false);
  const modalLinkRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [password, setPassword] = useState('');
  const [showModalBackup, setShowModalBackup] = useState(false);
  const [loadingRecoveryFile, setLoadingRecoveryFile] = useState(false);
  const [errorPassword, setErrorPassword] = useState<string>('');
  const modalBackupRef = useRef<HTMLDivElement>(null);
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
    if (seed) {
      setDisposableAccount(true);
    } else {
      setDisposableAccount(false);
    }
  }, [seed]);

  useEffect(() => {
    const handleClickOutsideModal = (event: MouseEvent) => {
      if (
        modalLinkRef.current &&
        !modalLinkRef.current.contains(event.target as Node)
      ) {
        setShowModalLink(false);
      }
      if (
        modalBackupRef.current &&
        !modalBackupRef.current.contains(event.target as Node)
      ) {
        setShowModalBackup(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutsideModal);

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideModal);
    };
  }, [modalLinkRef, setShowModalLink, modalBackupRef, setShowModalBackup]);

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

  const handleDownloadRecoveryFile = async ({
    recoveryFile,
    filename,
  }: {
    recoveryFile: Buffer;
    filename: string;
  }) => {
    try {
      const element = document.createElement('a');

      const fileBlob = new Blob([recoveryFile]);

      element.href = URL.createObjectURL(fileBlob);
      element.download = filename;
      document.body.appendChild(element); // Required for this to work in FireFox
      element.click();

      setSeed(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRecoveryFile = async () => {
    if (loadingRecoveryFile) {
      return;
    }
    try {
      setLoadingRecoveryFile(true);
      setErrorPassword('');

      const result = passwordSchema.safeParse({
        password,
      });

      if (!result.success) {
        setErrorPassword(
          result.error.errors.map((err) => err.message).join(', ')
        );
        setLoadingRecoveryFile(false);
        return;
      }
      const recoveryFileResponse = await getRecoveryFile(password);

      if (!recoveryFileResponse) {
        throw new Error('Something went wrong');
      }

      const { recoveryFile, filename } = recoveryFileResponse;
      await handleDownloadRecoveryFile({ recoveryFile, filename });
      Utils.storage.remove('seed');
      setShowModalBackup(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingRecoveryFile(false);
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
          className="h-auto text-[40px] font-bold sm:text-[100px] -mt-[50px]"
          defaultValue={name}
          maxLength={25}
          autoCorrect="off"
          error={errors.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setName(e.target.value)
          }
        />
        <Typography.PageTitle className="-mt-4 text-opacity-50 break-words">
          {handler}
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
                  maxLength={160}
                  defaultValue={bio}
                  error={errors.bio}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                    if (e.target.value === '') {
                      setBio('');
                    }
                    if (Utils.isValidContent(e.target.value)) {
                      const cleanedBio = Utils.cleanText(e.target.value);
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
              icon={<Icon.ArrowLeft />}
              className="w-[140px]"
              variant="secondary"
              onClick={() => router.back()}
            >
              Back
            </Button.Large>
          </Link>
          <Tooltip.RootSmall setShowTooltip={setShowTooltip}>
            <Button.Large
              icon={<Icon.Lock color={disposableAccount ? ' white' : 'gray'} />}
              disabled={!disposableAccount}
              onClick={
                disposableAccount ? () => setShowModalBackup(true) : undefined
              }
              className="w-[250px]"
              variant="secondary"
            >
              Backup
            </Button.Large>
            {showTooltip && !seed && (
              <Tooltip.Small>
                <Typography.Body variant="small" className="text-opacity-80">
                  You have already done the backup,{' '}
                  <span className="text-white font-bold text-opacity-100">
                    your seed has been deleted
                  </span>
                  .
                </Typography.Body>
              </Tooltip.Small>
            )}
          </Tooltip.RootSmall>
          <Button.Large
            onClick={!loading ? () => handleSubmit() : undefined}
            loading={loading}
            icon={<Icon.Check />}
            className="w-[140px] z-20"
          >
            Update
          </Button.Large>
        </div>
      </Content.Grid>
      <Modal.Link
        showModalLink={showModalLink}
        setShowModalLink={setShowModalLink}
        modalLinkRef={modalLinkRef}
        onAddLink={handleAddLink}
      />
      <Modal.Backup
        loading={loadingRecoveryFile}
        setPassword={setPassword}
        handleSubmit={handleRecoveryFile}
        showModalBackup={showModalBackup}
        setShowModalBackup={setShowModalBackup}
        modalBackupRef={modalBackupRef}
        errors={errorPassword}
      />
    </Content.Main>
  );
}
