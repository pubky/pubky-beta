'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Header, Content, Typography, Button, Icon } from '@social/ui-shared';
import { usePubkyClientContext } from '@/contexts';
import { useIsMobile } from '@/hooks/useIsMobile';
import { SocialLinks } from '@/components';

export default function Index() {
  const { pubky, isLoggedIn } = usePubkyClientContext();
  const isMobile = useIsMobile();
  const currentYear = new Date().getFullYear();
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
    <Content.Main shadowBottom>
      <Header.Root className="backdrop-blur-[0px]">
        <Header.Logo link={logoLink} />
        <div className="flex gap-6 items-center">
          <SocialLinks className="hidden sm:inline-flex" />
          <Header.Action icon={<Icon.SignIn size="16" />} link="/sign-in" id="onboarding-sign-in-btn">
            Sign in
          </Header.Action>
        </div>
      </Header.Root>
      <Content.Grid className="relative z-20 xl:mt-14">
        <Typography.Display className="text-5xl sm:text-7xl xl:text-9xl xl:leading-[128px]">
          Unlock <br />
          the web.
        </Typography.Display>
        <Typography.Body variant="large" className="text-[22px] sm:text-2xl leading-tight text-opacity-50 mt-2 sm:mt-4">
          Your keys, your content, your rules.
        </Typography.Body>
        <div className="relative flex gap-3 mt-6 sm:mt-12">
          <Link href="/onboarding/intro">
            <Button.Large
              id="onboarding-create-account-btn"
              className="w-auto lg:w-[156px] bg-[#c8ff00] border-[#c8ff00]"
              colorText="text-[#c8ff00]"
            >
              Create Account
            </Button.Large>
          </Link>
          {/** 
          <Button.Large
            id="onboarding-explore-pubky-btn"
            onClick={!loading ? () => handleSubmit() : undefined}
            variant="secondary"
            className={`w-auto ${loading ? 'w-auto' : 'lg:w-[156px]'}`}
            loading={loading}
          >
            {loading
              ? isMobile
                ? `Profile... ${Math.floor(progress)}%`
                : `Creating Profile... ${Math.floor(progress)}%`
              : 'Explore Pubky'}
          </Button.Large>
          */}
          <Link href="https://pubky.org" target="_blank">
            <Button.Large variant="secondary" className="w-auto lg:w-[156px]">
              Pubky Core
            </Button.Large>
          </Link>
        </div>
        <div className="fixed bottom-12">
          <SocialLinks className="sm:hidden inline-flex" />
          <Typography.Body variant="small" className="text-[13.5px] text-opacity-30 font-normal">
            Synonym Software Ltd. ©{currentYear}.
          </Typography.Body>
        </div>
      </Content.Grid>
      <div className="w-full">
        <div
          style={{
            backgroundImage: isMobile ? "url('/images/webp/home-mobile.webp')" : "url('/images/webp/home.webp')"
          }}
          className="fixed inset-0 bg-cover bg-center pointer-events-none"
        />
      </div>
    </Content.Main>
  );
}
