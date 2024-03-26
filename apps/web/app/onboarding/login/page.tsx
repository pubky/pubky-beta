/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { useClientContext } from '../../../contexts/client';
import { useRouter } from 'next/navigation';
import { Onboarding } from '../components';
import { Button, Card, Content, Icon, Input } from '@social/ui-shared';

export default function Index() {
  const router = useRouter();
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
      const loggedIn = await decryptRecoveryFile(password, recoveryFile);
      if (loggedIn) {
        router.push('/home');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Onboarding.Layout currentStep={2}>
      <div className="w-full flex flex-col items-center">
        <div className="w-[420px] sm:grid sm:grid-cols-1 lg:grid-cols-1 gap-6 mt-12">
          <Card.Primary title="Recovery Password">
            <Input.Label className="mt-4" value="Password" />
            <Input.Text
              className="h-[70px]"
              type="password"
              onChange={(e: any) => setPassword(e.target.value)}
            />
          </Card.Primary>
          <Card.Primary title="Recovery File">
            <Input.Label className="mt-4" value="Upload Recovery file" />
            <input
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 p-5"
              id="file_input"
              type="file"
              required
              onChange={UploadRecoveryFile}
            />
            <div className="pt-[40px]">
              <Button.Large
                onClick={() => handleSubmit()}
                icon={<Icon.Check />}
              >
                Login
              </Button.Large>
            </div>
          </Card.Primary>
          <Content.MainBg alt="Onboard Pubky" imgSrc="/images/bg-image-2.png" />
        </div>
      </div>
    </Onboarding.Layout>
  );
}
