'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Header, Content, Typography, Button, Icon } from '@social/ui-shared';
//import * as jdenticon from 'jdenticon';
import { usePubkyClientContext } from '@/contexts';
//import { Links } from '@/types/Post';
//import { Utils } from '@social/utils-shared';
import { useIsMobile } from '@/hooks/useIsMobile';
import { Utils } from '@social/utils-shared';
//import { useRouter } from 'next/navigation';

export default function Index() {
  const { pubky, isLoggedIn } = usePubkyClientContext();
  const isMobile = useIsMobile();
  //const router = useRouter();
  const currentYear = new Date().getFullYear();
  const inviteCode = Utils.storage.get('inviteCode');
  const [logoLink, setLogoLink] = useState('/onboarding');
  //const [progress, setProgress] = useState(0);
  //const [loading, setLoading] = useState(false);
  //const links: Links[] = [];

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
          <div className="h-6 justify-start items-start gap-6 sm:inline-flex hidden">
            <Link
              target="_blank"
              href="https://github.com/pubky"
              className="cursor-pointer opacity-30 hover:opacity-100"
            >
              <Icon.Github size="24" />
            </Link>
            <Link
              target="_blank"
              href="https://x.com/getpubky"
              className="cursor-pointer opacity-30 hover:opacity-100"
            >
              <Icon.Twitter size="24" />
            </Link>
            <Link
              target="_blank"
              href="https://www.youtube.com/channel/UCyNruUjynpzvQXNTxbJBLmg"
              className="cursor-pointer opacity-30 hover:opacity-100"
            >
              <Icon.Youtube width="24" height="24" />
            </Link>
            <Link
              target="_blank"
              href="https://medium.com/pubky"
              className="cursor-pointer opacity-30 hover:opacity-100"
            >
              <Icon.Medium size="24" />
            </Link>
          </div>
          <Header.Action
            icon={<Icon.SignIn size="16" />}
            link={inviteCode ? '/sign-in' : '/invite-code'}
            id="onboarding-sign-in-btn"
          >
            Sign in
          </Header.Action>
        </div>
      </Header.Root>
      <Content.Grid className="relative z-20 xl:mt-14">
        <Typography.Display className="text-5xl sm:text-7xl xl:text-9xl xl:leading-[128px]">
          Unlock <br />
          the web.
        </Typography.Display>
        <Typography.Body
          variant="large"
          className="text-[22px] sm:text-2xl leading-tight text-opacity-50 mt-2 sm:mt-4"
        >
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
          <div className="mb-2 h-6 justify-start items-start gap-6 inline-flex sm:hidden">
            <Link
              target="_blank"
              href="https://github.com/pubky"
              className="cursor-pointer opacity-30 hover:opacity-100"
            >
              <Icon.Github size="24" />
            </Link>
            <Link
              target="_blank"
              href="https://x.com/getpubky"
              className="cursor-pointer opacity-30 hover:opacity-100"
            >
              <Icon.Twitter size="24" />
            </Link>
            <Link
              target="_blank"
              href="https://www.youtube.com/channel/UCyNruUjynpzvQXNTxbJBLmg"
              className="cursor-pointer opacity-30 hover:opacity-100"
            >
              <Icon.Youtube width="24" height="24" />
            </Link>
            <Link
              target="_blank"
              href="https://medium.com/pubky"
              className="cursor-pointer opacity-30 hover:opacity-100"
            >
              <Icon.Medium size="24" />
            </Link>
          </div>
          <Typography.Body
            variant="small"
            className="text-[13.5px] text-opacity-30 font-normal"
          >
            Synonym Software Ltd. ©{currentYear}.
          </Typography.Body>
        </div>
      </Content.Grid>
      <div className="w-full">
        <div
          style={{
            backgroundImage: isMobile
              ? "url('/images/webp/home-mobile.webp')"
              : "url('/images/webp/home.webp')",
            marginTop: isMobile ? '150px' : '',
          }}
          className="fixed inset-0 bg-cover bg-center pointer-events-none"
        />
      </div>
    </Content.Main>
  );
}
