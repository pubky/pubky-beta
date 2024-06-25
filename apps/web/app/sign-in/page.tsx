'use client';

import { useEffect, useState } from 'react';
import { useClientContext } from '../../contexts/client';
import { useRouter } from 'next/navigation';
import {
  Content,
  Typography,
  Button,
  Icon,
  Card,
  Input,
  Header,
} from '@social/ui-shared';
import { z } from 'zod';
import Image from 'next/image';

interface FormErrors {
  [fieldName: string]: string[];
}

const loginSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  recoveryFile: z
    .any()
    .refine((file) => file !== null, 'Recovery file is required'),
});

export default function Index() {
  const router = useRouter();
  const { decryptRecoveryFile } = useClientContext();
  const { pubky, isLoggedIn } = useClientContext();
  const [logoLink, setLogoLink] = useState('/onboarding');
  const [fileName, setFileName] = useState('recoveryfile.key');

  const [recoveryFile, setRecoveryFile] = useState<Buffer | null>(null);
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({
    password: '',
    recoveryFile: '',
  });
  const [loginError, setLoginError] = useState(false);
  const [userNotFound, setUserNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  const UploadRecoveryFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFileName(event.target.files[0].name);
    }

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
    if (loading) {
      return;
    }
    try {
      setLoading(true);
      setErrors({
        password: '',
        recoveryFile: '',
      });

      const result = loginSchema.safeParse({
        password,
        recoveryFile,
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

      if (!recoveryFile || !password) return;

      try {
        const loggedIn = await decryptRecoveryFile(password, recoveryFile);

        if (loggedIn) {
          router.push('/home');
        } else if (loggedIn === undefined) {
          setUserNotFound(true);
          setLoginError(false);
          setLoading(false);
        } else {
          setLoginError(true);
          setUserNotFound(false);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  useEffect(() => {
    async function fetchData() {
      const loggedIn = await isLoggedIn();
      if (!loggedIn) {
        setLogoLink('/onboarding');
      } else {
        setLogoLink('/home');
      }
    }
    fetchData();
  }, [pubky, isLoggedIn]);
  return (
    <Content.Main>
      <Header.Root>
        <Header.Logo link={logoLink} />
        <Header.Title titleHeader="Sign in" />
        <Header.Action link="/onboarding/sign-in">New here?</Header.Action>
      </Header.Root>
      <Content.Grid>
        <Typography.Display>Sign in to Pubky</Typography.Display>
        <Typography.PageTitle className="text-opacity-50 mt-4 sm:mt-0">
          Choose to sign in with a QR, recovery file, or recovery phrase
        </Typography.PageTitle>
        <div className="w-full flex-col inline-flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          <Card.Primary
            title="Sign in with Bitkit"
            text="Use Bitkit or another Pubky Core powered wallet. Scan the QR to sign in."
          >
            <Image
              width={320}
              height={320}
              className="mt-6"
              alt="qr"
              src="/images/qr.png"
            />
            <Content.LinksStoreApp />
          </Card.Primary>
          <Card.Primary
            title="Recovery File"
            text="Upload your Pubky recovery file and enter your password."
          >
            <div className="flex-col inline-flex gap-4">
              <div>
                <Input.Label className="mt-4" value="Recovery file" />
                <Input.UploadFile
                  required
                  error={errors.recoveryFile}
                  fileName={fileName}
                  className="mt-3"
                  id="file_input"
                  onChange={UploadRecoveryFile}
                />
              </div>
              <div>
                <Input.Label className="mt-4" value="Password" />
                <Input.Text
                  className="h-[70px] mt-3"
                  type="password"
                  error={errors.password}
                  placeholder="••••••••••••"
                  id="onboarding-password-input"
                  onKeyDown={handleKeyDown}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setPassword(e.target.value)
                  }
                />
              </div>
            </div>
            {loginError && (
              <div className="flex justify-center items-center px-4 py-2 mt-6 mb-4 rounded-lg border-2 border-[#e95164] bg-[#e95164] bg-opacity-10">
                <Typography.Body
                  className="text-[#e95164]"
                  variant="small-bold"
                >
                  Recovery password or recovery file incorrect
                </Typography.Body>
                <Icon.Warning color="#e95164" />
              </div>
            )}
            {userNotFound && (
              <div className="flex justify-center items-center px-4 py-2 mt-6 mb-4 rounded-lg border-2 border-fuchsia-500 bg-fuchsia-500 bg-opacity-10">
                <Typography.Body
                  className="text-fuchsia-500"
                  variant="small-bold"
                >
                  Your profile was not found, please{' '}
                  <span
                    onClick={() => router.push('/onboarding/sign-in')}
                    className="text-white text-opacity-90 hover:text-opacity-100 cursor-pointer"
                  >
                    create a new one
                  </span>
                </Typography.Body>
                <Icon.Warning color="#d946ef" />
              </div>
            )}
            <Button.Large
              onClick={!loading ? () => handleSubmit() : undefined}
              icon={<Icon.Key size="16" />}
              loading={loading}
              className="mt-4"
              id="onboarding-sign-in-button"
            >
              Sign in
            </Button.Large>
          </Card.Primary>
          <Card.Primary
            title="Recovery Phrase"
            text="Enter your recovery phrase from any (paper) backup (less secure)."
          >
            <div className="my-6 grid grid-rows-6 grid-flow-col gap-1">
              <Input.Word placeholder="1." disabled />
              <Input.Word placeholder="2." disabled />
              <Input.Word placeholder="3." disabled />
              <Input.Word placeholder="4." disabled />
              <Input.Word placeholder="5." disabled />
              <Input.Word placeholder="6." disabled />
              <Input.Word placeholder="7." disabled />
              <Input.Word placeholder="8." disabled />
              <Input.Word placeholder="9." disabled />
              <Input.Word placeholder="10." disabled />
              <Input.Word placeholder="11." disabled />
              <Input.Word placeholder="12." disabled />
            </div>
            <Button.Large
              disabled
              className="mt-4 lg:mt-0"
              icon={<Icon.Key size="16" color="gray" />}
            >
              Sign in
            </Button.Large>
          </Card.Primary>
        </div>
        <Content.MainBg alt="Onboard Pubky" imgSrc="/images/bg-image-4.png" />
      </Content.Grid>
    </Content.Main>
  );
}
