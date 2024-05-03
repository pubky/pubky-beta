'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Header, Content, Typography, Button } from '@social/ui-shared';

import { useClientContext } from '../../contexts/client';
import { useEffect, useState } from 'react';

export default function Index() {
  const { pubky, isLoggedIn } = useClientContext();
  const [logoLink, setLogoLink] = useState('/onboarding');

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
    <Content.Main background="bg-black" className="pb-0">
      <Header.Root>
        <Header.Logo link={logoLink} />
        <Header.Action>Sign in</Header.Action>
      </Header.Root>
      <Content.Grid>
        <Typography.Display>Become the algorithm</Typography.Display>
        <Typography.PageTitle className="text-opacity-50 mt-4 sm:mt-0">
          Your keys, your content, your rules. Social publishing, reimagined.
        </Typography.PageTitle>
        <div className="relative flex gap-6">
          <Link id="onboarding-sign-in-link" href="/onboarding/sign-in">
            <Button.Large className="sm:w-80 w-full mt-12 relative z-20">
              Let&apos;s get started
            </Button.Large>
          </Link>
          <Link href="">
            <Button.Large variant="secondary" className=" mt-12 relative z-20">
              Explore first
            </Button.Large>
          </Link>
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
