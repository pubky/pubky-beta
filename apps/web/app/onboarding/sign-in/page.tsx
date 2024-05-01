'use client';

import { useState } from 'react';
import { useClientContext } from '../../../contexts/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Content,
  Typography,
  Button,
  Icon,
  Card,
  Input,
} from '@social/ui-shared';
import { Onboarding } from '../components';
import { z } from 'zod';

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

  const [recoveryFile, setRecoveryFile] = useState<Buffer | null>(null);
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({
    password: '',
    recoveryFile: '',
  });
  const [loginError, setLoginError] = useState(false);
  const [loading, setLoading] = useState(false);

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
          router.push('/onboarding/permissions');
        } else {
          setLoginError(true);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Onboarding.Layout currentStep={1}>
      <Typography.Display>Let&apos;s get started</Typography.Display>
      <Typography.PageTitle className="text-opacity-50 mt-4 sm:mt-0">
        Sign in with a QR, download Bitkit, or create a new account.
      </Typography.PageTitle>
      <div className="w-full flex-col inline-flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        {/* <Card.Primary
          title="Sign in with Slashtag"
          text="Have Bitkit or a Slashtags powered wallet? Scan this QR to sign in."
        >
          <Link href="/onboarding/permissions">
            <Image
              width={320}
              height={320}
              className="mt-6"
              alt="qr"
              src="/images/qr.png"
            />
          </Link>
        </Card.Primary> */}
        <Card.Primary
          className="min-h-[500px]"
          title="Portable Profile"
          text="Download Bitkit and create a portable profile in minutes."
        >
          <Content.LinksStoreApp className="mt-4 mb-6 md:mt-0 md:mb-0 lg:mt-4 lg:mb-6 xl:mt-0 xl:mb-0" />
          <Link href="https://bitkit.to/">
            <Button.Large icon={<Icon.ArrowUpRight />}>
              About Bitkit
            </Button.Large>
          </Link>
        </Card.Primary>
        <Card.Primary
          title="Login with Recovery File"
          text="You need your recovery password and recovery file"
        >
          <div>
            <Input.Label className="mt-4" value="Password" />
            <Input.Text
              className="h-[70px]"
              type="password"
              error={errors.password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
            />
          </div>
          <div>
            <Input.Label className="mt-4" value="Upload Recovery file" />
            <Input.UploadFile
              required
              error={errors.recoveryFile}
              className="mt-3"
              id="file_input"
              onChange={UploadRecoveryFile}
            />
          </div>
          {loginError && (
            <div className="flex justify-center items-center px-4 py-2 mt-6 mb-4 rounded-lg border-2 border-[#e95164] bg-[#e95164] bg-opacity-10">
              <Typography.Body className="text-[#e95164]" variant="small-bold">
                Recovery password or recovery file incorrect
              </Typography.Body>
              <Icon.Warning color="#e95164" />
            </div>
          )}
          <Button.Large
            onClick={!loading ? () => handleSubmit() : undefined}
            icon={<Icon.Check />}
            loading={loading}
            className="mt-4"
          >
            Login
          </Button.Large>
        </Card.Primary>
        <Card.Primary
          title="New Pubky Account"
          text="Another option is to create a new Pubky account."
        >
          <Link href="/onboarding/sign-up" className="mt-4 lg:mt-0">
            <Button.Large icon={<Icon.UserRectangle />}>
              Create Account
            </Button.Large>
          </Link>
        </Card.Primary>
      </div>
      <Content.MainBg alt="Onboard Pubky" imgSrc="/images/bg-image1.png" />
    </Onboarding.Layout>
  );
}
