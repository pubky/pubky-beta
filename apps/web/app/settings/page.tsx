/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  Content,
  Typography,
  Button,
  Input,
  Card,
  Icon,
} from '@social/ui-shared';
import { Header } from '../components';
import { useClientContext } from '../../contexts/client';
import { minifyPubky } from '../../libs/pubkyHelper';
import { useRouter } from 'next/navigation';
import { z } from 'zod';

interface FormErrors {
  [fieldName: string]: string[];
}

const profileSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  bio: z.string().min(3, { message: 'Short bio is required' }).optional(),
  website: z.string().url({ message: 'Invalid website URL' }).optional(),
  email: z.string().email({ message: 'Invalid email address' }).optional(),
  x: z.string().optional(),
  telegram: z.string().optional(),
});

export default function Index() {
  const router = useRouter();
  const { pubky, signUp, saveProfile, getProfile } = useClientContext();

  const [handler, setHandler] = useState('Loading...');
  const [name, setName] = useState(undefined);
  const [bio, setBio] = useState(undefined);
  const [image, setImage] = useState('/images/Userpic.png');
  const [website, setWebsite] = useState(undefined);
  const [email, setEmail] = useState(undefined);
  const [x, setX] = useState(undefined);
  const [telegram, setTelegram] = useState(undefined);
  const [errors, setErrors] = useState({
    name: '',
    bio: '',
    website: '',
    email: '',
    x: '',
    telegram: '',
  });

  useEffect(() => {
    setHandler(minifyPubky(pubky));
    async function fetchData() {
      try {
        const profile = await getProfile(false);

        setName(profile.name);
        setBio(profile.bio);
        setImage(profile.image);

        for (const link of profile.links) {
          if (link.title === 'website') {
            setWebsite(link.url);
          } else if (link.title === 'email') {
            setEmail(link.url);
          } else if (link.title === 'x') {
            setX(link.url);
          } else if (link.title === 'telegram') {
            setTelegram(link.url);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [signUp, pubky, getProfile]);

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
    try {
      setErrors({
        name: '',
        bio: '',
        website: '',
        email: '',
        x: '',
        telegram: '',
      });

      const result = profileSchema.safeParse({
        name,
        bio: bio || undefined,
        website: website || undefined,
        email: email || undefined,
        x: x || undefined,
        telegram: telegram || undefined,
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

      await saveProfile({
        name,
        bio,
        image,
        links: {
          website,
          email,
          x,
          telegram,
        },
      });

      router.push('/profile');
    } catch (error) {
      console.log(error);
    }
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
          className="h-14 text-[40px] font-bold sm:h-[174px] sm:text-[100px]"
          defaultValue={name}
          autoFocus
          autoCorrect="off"
          error={errors.name}
          onChange={(e: any) => setName(e.target.value)}
        />
        <Typography.PageTitle className="text-opacity-50 break-words">
          {handler}
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
                className="h-[422px]"
                defaultValue={bio}
                error={errors.bio}
                onChange={(e: any) => setBio(e.target.value)}
              />
            </Card.Primary>
          </Card.Primary>
          <Card.Primary title="Links">
            <Input.Label className="mt-4" value="Website" />
            <Input.Text
              className="h-[70px]"
              placeholder="https://"
              defaultValue={website}
              error={errors.website}
              onChange={(e: any) => setWebsite(e.target.value)}
            />

            <Input.Label className="mt-4" value="Email" />
            <Input.Text
              className="h-[70px]"
              placeholder="user@provider.com"
              defaultValue={email}
              error={errors.email}
              onChange={(e: any) => setEmail(e.target.value)}
            />

            <Input.Label className="mt-4" value="x (twitter)" />
            <Input.Text
              className="h-[70px]"
              placeholder="@user"
              defaultValue={x}
              error={errors.x}
              onChange={(e: any) => setX(e.target.value)}
            />

            <Input.Label className="mt-4" value="telegram" />
            <Input.Text
              className="h-[70px]"
              placeholder="@user"
              defaultValue={telegram}
              error={errors.telegram}
              onChange={(e: any) =>
                setTelegram(e.target.value.replace('@', ''))
              }
            />
          </Card.Primary>
          <Card.Primary title="Picture">
            <label htmlFor="fileInput">
              {image && (
                <Image
                  width={320}
                  height={320}
                  className="w-80 h-auto mt-6 rounded-full cursor-pointer"
                  alt="user"
                  src={image}
                />
              )}
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                onChange={UploadPic}
                style={{ display: 'none' }}
              />
            </label>
            <div className="pt-[40px]">
              <Button.Large
                onClick={() => handleSubmit()}
                icon={<Icon.Check />}
              >
                Finish
              </Button.Large>
            </div>
          </Card.Primary>
          <Content.MainBg alt="Onboard Pubky" imgSrc="/images/bg-image-2.png" />
        </div>
      </Content.Grid>
    </Content.Main>
  );
}
