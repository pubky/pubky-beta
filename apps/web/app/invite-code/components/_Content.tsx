'use client';

import { useEffect, useState } from 'react';
import { usePubkyClientContext } from '@/contexts';
import {
  Content,
  Typography,
  Header,
  Input,
  Icon,
  Button,
} from '@social/ui-shared';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Utils } from '@social/utils-shared';
import Link from 'next/link';

export default function Index() {
  const { isLoggedIn, pubky } = usePubkyClientContext();
  const router = useRouter();
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [logoLink, setLogoLink] = useState('/onboarding');

  const handleInviteCode = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    if (!inviteCode) {
      setError('Empty invite code.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/invite-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inviteCode }),
      });

      const data = await response.json();

      if (!data.valid) {
        setError('Incorrect invite code. Please try again.');
        setLoading(false);
        return;
      }

      setSuccess('Invite code valid. Welcome to the Pubky Private Beta.');
      setError('');

      Utils.storage.set('inviteCode', inviteCode);
      router.push('/onboarding/sign-in');
    } catch (error) {
      console.error('Error during invite code validation:', error);
      setError('An error occurred. Please try again later.');
      setLoading(false);
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
  }, [isLoggedIn, pubky]);

  useEffect(() => {
    const initialInviteCode = Utils.storage.get('inviteCode');
    if (initialInviteCode) setInviteCode(String(initialInviteCode));
  }, []);

  return (
    <Content.Main className="sm:pt-[125px]">
      <Header.Root>
        <div className="flex gap-3 lg:gap-6 w-auto">
          <Header.Logo link={logoLink} />
          <Header.Title
            titleHeader="Early Access"
            className="hidden sm:flex justify-end sm:justify-start"
          />
        </div>
      </Header.Root>
      <Content.Grid>
        <Input.Cursor
          placeholder="Invite Code"
          className="uppercase h-14 text-[40px] font-bold sm:h-[106px] sm:text-[64px] placeholder:text-opacity-20 placeholder:normal-case"
          defaultValue={inviteCode}
          disabled={loading}
          maxLength={8}
          autoFocus
          id="onboarding-name-input"
          autoCorrect="off"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setInviteCode(e.target.value.toUpperCase());
            setError('');
          }}
        />
        <Typography.Body
          variant="large"
          className={`${error ? 'text-red-500' : 'text-white text-opacity-50'} text-[22px] sm:text-2xl leading-tight mt-2 sm:mt-0`}
        >
          {success ||
            error ||
            'Pubky is currently in a Private Beta. Enter your invite code for early access to Pubky.'}
        </Typography.Body>
        <div className="relative my-6 w-full bg-white bg-opacity-10 rounded-lg flex-col justify-center items-center inline-flex">
          <div className="p-12 flex-col justify-center items-center flex">
            <div className="p-7">
              {success || error ? (
                <Icon.LockKeyOpen
                  size="130"
                  color={success ? '#C8FF00' : '#FF0000'}
                />
              ) : (
                <Icon.Lock size="130" />
              )}
              <Image
                alt="glow"
                fill
                src={
                  success
                    ? '/images/webp/glow-2.webp'
                    : error
                      ? '/images/webp/glow-3.webp'
                      : '/images/webp/glow-1.webp'
                }
              />
            </div>
          </div>
        </div>
        <div className="w-full max-w-[1200px] justify-between items-center inline-flex">
          <Link href="/onboarding">
            <Button.Large
              icon={<Icon.ArrowLeft />}
              className="w-[140px]"
              variant="secondary"
            >
              Back
            </Button.Large>
          </Link>
          <Button.Large
            onClick={!loading ? () => handleInviteCode() : undefined}
            icon={<Icon.ArrowRight />}
            className="w-[140px] z-20"
            loading={loading}
          >
            Continue
          </Button.Large>
        </div>
      </Content.Grid>
    </Content.Main>
  );
}
