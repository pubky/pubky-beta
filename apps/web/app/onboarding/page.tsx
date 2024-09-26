'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Header, Content, Typography, Button } from '@social/ui-shared';
import { useRouter } from 'next/navigation';
import { ILinkPubky } from '@/types';
import { usePubkyClientContext } from '@/contexts';

export default function Index() {
  const { pubky, signUp, isLoggedIn } = usePubkyClientContext();
  const router = useRouter();
  const [logoLink, setLogoLink] = useState('/onboarding');
  const [loading, setLoading] = useState(false);
  const links: ILinkPubky = {};

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

  const handleSubmit = async () => {
    if (loading) {
      return;
    }
    try {
      setLoading(true);

      const signUpResponse = await signUp({
        name: '',
        bio: '',
        image: '/images/Userpic.png',
        links: links,
      });

      if (!signUpResponse) {
        throw new Error('Something went wrong');
      }

      router.push('/home');
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Content.Main>
      <Header.Root>
        <Header.Logo link={logoLink} />
        <Header.Action id="onboarding-sign-in-btn">Sign in</Header.Action>
      </Header.Root>
      <Content.Grid className="relative z-20">
        <Typography.Display>Become the algorithm</Typography.Display>
        <Typography.H2 variant="light" className="text-opacity-50 mt-4 sm:mt-0">
          Your keys, your content, your rules. Social publishing, reimagined.
        </Typography.H2>
        <div className="relative flex gap-3">
          <Link id="onboarding-get-started-link" href="/onboarding/intro">
            <Button.Large className="mt-12">Get started</Button.Large>
          </Link>
          <Button.Large
            onClick={!loading ? () => handleSubmit() : undefined}
            variant="secondary"
            className="w-auto mt-12"
            loading={loading}
          >
            Explore first
          </Button.Large>
        </div>
      </Content.Grid>
      <div className="w-full">
        <div className="absolute inset-0 bg-cover bg-center bg-[url('/images/background-image.png')]" />
      </div>
    </Content.Main>
  );
}
