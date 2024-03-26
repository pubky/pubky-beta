/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { Content, Button, Input, Card, Icon } from '@social/ui-shared';
import { Onboarding } from '../components';
import { useClientContext } from '../../../contexts/client';

export default function Index() {
  const { decryptRecoveryFile } = useClientContext();

  const [recoveryFile, setRecoveryFile] = useState<Buffer | null>(null);
  const [password, setPassword] = useState('');

  const UploadRecoveryFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setRecoveryFile(Buffer.from(reader.result as ArrayBuffer));
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!recoveryFile) return;
      const seed = await decryptRecoveryFile(password, recoveryFile);
      // Login then zerozie the seed
      console.log({ seed });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Onboarding.Layout currentStep={2}>
      <div className="w-full flex-col inline-flex sm:grid sm:grid-cols-2 lg:grid-cols-2 gap-6 mt-12">
        <Card.Primary title="Recovery Password">
          <Input.Label className="mt-4" value="Password" />
          <Input.Text
            className="h-[70px]"
            type="password"
            onChange={(e: any) => setPassword(e.target.value)}
          />
        </Card.Primary>
        <Card.Primary title="Recovery File">
          <label htmlFor="fileInput">
            {/* {image && (
              <Image
                width={320}
                height={320}
                className="w-80 h-auto mt-6 rounded-full cursor-pointer"
                alt="user"
                src={image}
              />
            )} */}
            <input
              type="file"
              name="file"
              id="fileInput"
              required
              onChange={UploadRecoveryFile}
            />
          </label>
          <div className="pt-[40px]">
            <Button.Large onClick={() => handleSubmit()} icon={<Icon.Check />}>
              Login
            </Button.Large>
          </div>
        </Card.Primary>
        <Content.MainBg alt="Onboard Pubky" imgSrc="/images/bg-image-2.png" />
      </div>
    </Onboarding.Layout>
  );
}
