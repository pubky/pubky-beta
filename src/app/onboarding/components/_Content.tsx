'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Header, Content, Typography, Button, Icon } from '@social/ui-shared';
import { usePubkyClientContext } from '@/contexts';
import { useIsMobile } from '@/hooks/useIsMobile';
import { SocialLinks } from '@/components';

export default function Index() {
  const { pubky, isLoggedIn } = usePubkyClientContext();
  const isMobile = useIsMobile(768);
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

  useEffect(() => {
    // Disable vertical scroll on body
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <Content.Main className="overflow-hidden overflow-y-hidden h-screen">
      <Header.Root className="bg-gradient-to-b from-transparent via-transparent backdrop-blur-[0px]">
        <Header.Logo link={logoLink} />
        <div className="flex gap-6 items-center">
          <SocialLinks
            colorIcon={!isMobile ? '#000000' : 'white'}
            classNameIcon={!isMobile && 'opacity-100 hover:opacity-90'}
            className="hidden sm:inline-flex"
          />
          <Header.Action
            className="md:bg-black md:bg-opacity-100 md:hover:bg-opacity-90"
            icon={<Icon.SignIn size="16" />}
            link="/sign-in"
            id="onboarding-sign-in-btn"
          >
            Sign in
          </Header.Action>
        </div>
      </Header.Root>
      <Content.Grid className="relative z-20 xl:mt-14 h-[calc(100vh-80px)]">
        <Typography.Display className="text-[64px] leading-[64px] sm:text-7xl md:text-9xl md:leading-[128px] xl:text-[128px] xl:leading-[128px]">
          <span className="text-[#c8ff00]">Unlock</span> <br />
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
          <Link href="/sign-in">
            <Button.Large variant="secondary" className="md:w-[156px]">
              Sign In
            </Button.Large>
          </Link>
        </div>
        <div className="fixed bottom-4">
          <SocialLinks
            colorIcon="#C8FF00"
            classNameIcon="opacity-100 hover:opacity-90"
            className="sm:hidden inline-flex"
          />
          <Typography.Body
            variant="small"
            className="text-[13.5px] text-[#C8FF00] md:text-white md:text-opacity-50 font-normal"
          >
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
