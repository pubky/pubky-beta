'use client';

import { useState } from 'react';
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

interface FormErrors {
  [fieldName: string]: string[];
}

const profileSchema = z.object({
  name: z.string().max(24, { message: 'Maximum length 24 characters' }),
  bio: z
    .string()
    .max(140, { message: 'Maximum length 140 characters' })
    .optional(),
  website: z.string().url({ message: 'Invalid website URL' }).optional(),
  email: z.string().email({ message: 'Invalid email address' }).optional(),
  x: z.string().optional(),
  telegram: z.string().optional(),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' }),
});

export default function Index() {
  const { signUp } = useClientContext();

  const router = useRouter();

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [image, setImage] = useState('/images/Userpic.png');
  const [website, setWebsite] = useState('');
  const [email, setEmail] = useState('');
  const [x, setX] = useState('');
  const [telegram, setTelegram] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    bio: '',
    website: '',
    email: '',
    x: '',
    telegram: '',
    password: '',
  });

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
    } catch (error) {
      console.log(error);
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
        website: '',
        email: '',
        x: '',
        telegram: '',
        password: '',
      });

      const result = profileSchema.safeParse({
        name: name,
        bio: bio ? bio : undefined,
        website: website ? website : undefined,
        email: email ? email : undefined,
        x: x ? x : undefined,
        telegram: telegram ? telegram : undefined,
        password: password,
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
        const profileInfo = result.data;

        const signUpResponse = await signUp(
          {
            name,
            bio,
            image,
            links: {
              website,
              email,
              x,
              telegram,
            },
          },
          profileInfo.password
        );

        if (!signUpResponse) {
          throw new Error('Something went wrong');
        }

        const { recoveryFile, filename } = signUpResponse;
        await handleDownloadRecoveryFile({ recoveryFile, filename });
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
        className="h-14 text-[40px] font-bold sm:h-[174px] sm:text-[100px]"
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
        <Card.Primary title="Profile">
          <Input.Label className="mt-4" value="Short bio" />
          <Card.Primary
            background="bg-white bg-opacity-10"
            className="border border-white border-opacity-10 shadow-[0_4px_8px_0_rgba(0,0,0,0.32)_inset] rounded-lg"
          >
            <Input.TextArea
              placeholder="Short bio. Tell a bit about yourself."
              className="h-[370px]"
              id="onboarding-bio-input"
              defaultValue={bio ? bio : ''}
              error={errors.bio}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setBio(e.target.value)
              }
            />
          </Card.Primary>
        </Card.Primary>
        <Card.Primary title="Links">
          <div>
            <Input.Label className="mt-4" value="Website" />
            <Input.Text
              className="h-[70px]"
              placeholder="https://"
              defaultValue={website ? website : ''}
              error={errors.website}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setWebsite(e.target.value)
              }
            />
          </div>
          <div>
            <Input.Label className="mt-4" value="Email" />
            <Input.Text
              className="h-[70px]"
              placeholder="user@provider.com"
              defaultValue={email ? email : ''}
              error={errors.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
            />
          </div>
          <div>
            <Input.Label className="mt-4" value="x (twitter)" />
            <Input.Text
              className="h-[70px]"
              placeholder="@user"
              defaultValue={x ? x : ''}
              error={errors.x}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setX(e.target.value)
              }
            />
          </div>
          <div>
            <Input.Label className="mt-4" value="telegram" />
            <Input.Text
              className="h-[70px]"
              placeholder="@user"
              defaultValue={telegram ? telegram : ''}
              error={errors.telegram}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setTelegram(e.target.value.replace('@', ''))
              }
            />
          </div>
        </Card.Primary>
        <Card.Primary title="Picture">
          {image && (
            <div className="relative">
              <Image
                width={150}
                height={150}
                className="w-80 h-80 mt-6 rounded-full"
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
          <div>
            <Input.Label className="mt-6" value="Encrypt Recovery Password" />
            <Input.Text
              className="h-[70px]"
              type="password"
              error={errors.password}
              id="onboarding-recovery-password-input"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
            />
          </div>
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
    </Onboarding.Layout>
  );
}
