/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Content, Button, Input, Card, Icon } from '@social/ui-shared';
import { Onboarding } from '../components';
import { useClientContext } from '../../../contexts/client';
import { useRouter } from 'next/navigation';

export default function Index() {
  const { signUp } = useClientContext();

  const router = useRouter();

  const [name, setName] = useState('');
  const [info, setInfo] = useState('');
  const [image, setImage] = useState('/images/Userpic.png');
  const [website, setWebsite] = useState('');
  const [email, setEmail] = useState('');
  const [x, setX] = useState('');
  const [telegram, setTelegram] = useState('');
  const [password, setPassword] = useState('');

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
    try {
      // add validation here

      const profileInfo = {
        name,
        info,
        image,
        links: {
          website,
          email,
          x,
          telegram,
        },
      };

      const { recoveryFile, filename } = await signUp(profileInfo, password);
      await handleDownloadRecoveryFile({ recoveryFile, filename });
      router.push('/onboarding/confirm');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Onboarding.Layout currentStep={2}>
      <Input.Cursor
        placeholder="Your Name"
        className="h-14 text-[40px] font-bold sm:h-[174px] sm:text-[100px]"
        defaultValue={name}
        autoFocus
        autoCorrect="off"
        onChange={(e: any) => setName(e.target.value)}
      />
      <div className="w-full flex-col inline-flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        <Card.Primary title="Profile">
          <Input.Label className="mt-4" value="Short bio" />
          <Card.Primary
            background="bg-white bg-opacity-10"
            className="border border-white border-opacity-10 shadow-[0_4px_8px_0_rgba(0,0,0,0.32)_inset] rounded-lg"
          >
            <Input.TextArea
              placeholder="Short bio. Tell a bit about yourself."
              className="h-[490px]"
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
            {image && (
              <Image
                width={150}
                height={150}
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
          <div>
            <Input.Label className="mt-4" value="Encrypt Recovery File" />
            <Input.Text
              className="h-[70px]"
              type="password"
              onChange={(e: any) => setPassword(e.target.value)}
            />
          </div>
          <div className="pt-[20px]">
            <Button.Large onClick={() => handleSubmit()} icon={<Icon.Check />}>
              Download Recovery File
            </Button.Large>
          </div>
        </Card.Primary>
        <Content.MainBg alt="Onboard Pubky" imgSrc="/images/bg-image-2.png" />
      </div>
    </Onboarding.Layout>
  );
}
