'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Header, Content, Typography, Button } from '@social/ui-shared';
import { useRouter } from 'next/navigation';
import { ILinkPubky } from '@/types';
import { useClientContext } from '@/contexts';

export default function Index() {
  const { signUp } = useClientContext();
  const router = useRouter();
  const { pubky, isLoggedIn } = useClientContext();
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
    <Content.Main background="bg-black" className="pb-0">
      <Header.Root>
        <Header.Logo link={logoLink} />
        <Header.Action>Sign in</Header.Action>
      </Header.Root>
      <Content.Grid>
        <Typography.Display>Become the algorithm</Typography.Display>
        <Typography.H2 variant="light" className="text-opacity-50 mt-4 sm:mt-0">
          Your keys, your content, your rules. Social publishing, reimagined.
        </Typography.H2>
        <div className="relative flex gap-3">
          <Link id="onboarding-sign-in-link" href="/onboarding/sign-in">
            <Button.Large className="mt-12 relative z-20">
              Let&apos;s get started
            </Button.Large>
          </Link>
          <Button.Large
            onClick={!loading ? () => handleSubmit() : undefined}
            variant="secondary"
            className="w-auto mt-12 relative z-20"
            loading={loading}
          >
            Explore first
          </Button.Large>
          <Image
            src="/images/explosion.png"
            alt="explosion"
            width={768}
            height={768}
            className="absolute mt-10 sm:mt-0 xl:right-96 xl:top-14 z-10"
          />
        </div>
      </Content.Grid>
      <div className="relative h-screen overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-[url('/images/background-image.png')]" />
      </div>
    </Content.Main>
  );
}
