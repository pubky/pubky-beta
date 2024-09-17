'use client';

import { useEffect, useState } from 'react';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { usePubkyClientContext } from '@/contexts';
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
  const { loginWithFile, isLoggedIn, pubky } = usePubkyClientContext();
  const [logoLink, setLogoLink] = useState('/onboarding');
  const [fileName, setFileName] = useState('recoveryfile.key');

  const [recoveryFile, setRecoveryFile] = useState<Buffer | null>(null);
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({
    password: '',
    recoveryFile: '',
  });
  const [loginError, setLoginError] = useState('');
  const [userNotFound, setUserNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (loading) {
      return;
    }

    setLoading(true);
    setErrors({
      password: '',
      recoveryFile: '',
    });
    setLoginError('');

    try {
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

      const session = await loginWithFile(
        result.data?.password,
        result.data?.recoveryFile
      );

      console.log('session', session);

      router.push('/home');
    } catch (error: unknown | { message: string }) {
      const errorMessage = (error as Error)?.message || 'Failed to login';
      setLoginError(errorMessage);
      setLoading(false);
      setUserNotFound(false);
      console.error('Login error:', error);
    }
  };

  useEffect(() => {
    async function fetchData() {
      const loggedIn = await isLoggedIn();
      console.log('loggedIn', loggedIn);
      if (!loggedIn) {
        setLogoLink('/onboarding');
      } else {
        setLogoLink('/home');
      }
    }
    fetchData();
  }, [isLoggedIn, pubky]);

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
      </Content.Grid>
    </Content.Main>
  );
}
