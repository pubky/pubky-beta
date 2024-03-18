/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Content,
  Typography,
  Button,
  Input,
  Card,
  Icon,
} from '@social/ui-shared';
import { Onboarding } from '../components';
import { useClientContext } from '../../contexts/client';

export default function Index() {
  const { signUp, pubKey, getProfile, saveProfile } = useClientContext();

  const [name, setName] = useState('');
  const [info, setInfo] = useState('');
  const [pic, setPic] = useState('/images/Userpic.png');
  const [website, setWebsite] = useState('');
  const [email, setEmail] = useState('');
  const [x, setX] = useState('');
  const [telegram, setTelegram] = useState('');

  useEffect(() => {
    async function fetchData() {
      await signUp();
      await getProfile();
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const UploadPic = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPic(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    const profileInfo = {
      name,
      info,
      pic,
      links: {
        website,
        email,
        x,
        telegram,
      },
    };

    const result = await saveProfile(profileInfo);
    console.log(result);
  };

  return (
    <Onboarding.Layout currentStep={2}>
      <Input.Cursor
        placeholder="Your Name"
        className="h-14 text-[40px] font-bold sm:h-[174px] sm:text-[100px]"
        defaultValue={name}
        autoFocus
        onChange={(e: any) => setName(e.target.value)}
      />
      <Typography.PageTitle className="text-opacity-50 break-words">
        {pubKey ? `@${pubKey}` : 'Loading...'}
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
              defaultValue={info}
              onChange={(e: any) => setInfo(e.target.value)}
            />
          </Card.Primary>
        </Card.Primary>
        <Card.Primary title="Links">
          <Input.Label className="mt-4" value="Website" />
          <Input.Text
            className="h-[70px]"
            placeholder="https://"
            defaultValue={website}
            onChange={(e: any) => setWebsite(e.target.value)}
          />

          <Input.Label className="mt-4" value="Email" />
          <Input.Text
            className="h-[70px]"
            placeholder="user@provider.com"
            defaultValue={email}
            onChange={(e: any) => setEmail(e.target.value)}
          />

          <Input.Label className="mt-4" value="x (twitter)" />
          <Input.Text
            className="h-[70px]"
            placeholder="@user"
            defaultValue={x}
            onChange={(e: any) => setX(e.target.value)}
          />

          <Input.Label className="mt-4" value="telegram" />
          <Input.Text
            className="h-[70px]"
            placeholder="@user"
            defaultValue={telegram}
            onChange={(e: any) => setTelegram(e.target.value.replace('@', ''))}
          />
        </Card.Primary>
        <Card.Primary title="Picture">
          <label htmlFor="fileInput">
            {pic && (
              <Image
                width={320}
                height={320}
                className="w-80 h-auto mt-6 rounded-full cursor-pointer"
                alt="user"
                src={pic}
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
            <Link href="/onboarding/confirm">
              <Button.Large
                onClick={() => handleSubmit()}
                icon={<Icon.Check />}
              >
                Finish
              </Button.Large>
            </Link>
          </div>
        </Card.Primary>
        <Content.MainBg alt="Onboard Pubky" imgSrc="/images/bg-image-2.png" />
      </div>
    </Onboarding.Layout>
  );
}
