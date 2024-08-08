'use client';

import { useEffect, useState } from 'react';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useClientContext } from '@/contexts';
import { Content, Typography, Header } from '@social/ui-shared';
import { Card } from './Card';

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
        <Typography.H2 variant="light" className="text-opacity-50 mt-4 sm:mt-0">
          Choose to sign in with a QR, recovery file, or recovery phrase
        </Typography.H2>
        <div className="w-full flex-col inline-flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          <Card.SignIn />
          <Card.RecoveryFile
            errors={errors}
            fileName={fileName}
            setFileName={setFileName}
            setPassword={setPassword}
            loginError={loginError}
            userNotFound={userNotFound}
            loading={loading}
            handleSubmit={handleSubmit}
            setRecoveryFile={setRecoveryFile}
          />
          <Card.RecoveryPhrase />
        </div>
        <Content.MainBg alt="Onboard Pubky" imgSrc="/images/bg-image-4.png" />
      </Content.Grid>
    </Content.Main>
  );
}
