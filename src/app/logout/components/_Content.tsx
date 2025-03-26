'use client';

import { useEffect } from 'react';
import { Button, Content, Header, Icon, Typography } from '@social/ui-shared';
import { useFilterContext, usePubkyClientContext } from '@/contexts';
import Link from 'next/link';
import Image from 'next/image';
import { userProfileCache } from '@/components/utils-shared/lib/Helper/userProfileCache';

export default function Index() {
  const { logout } = usePubkyClientContext();
  const { resetDefault } = useFilterContext();

  useEffect(() => {
    resetDefault();
    userProfileCache.clear();
    logout();
  }, []);

  return (
    <Content.Main className="sm:pt-[125px]">
      <Header.Root>
        <div className="flex gap-3 lg:gap-6 w-full justify-between sm:justify-start items-center sm:items-start">
          <Header.Logo link="/onboarding" />
          <Header.Title
            titleHeader="Signed out"
            className="hidden sm:flex justify-end sm:justify-start self-center sm:self-end mt-1 sm:mt-0"
          />
          <Header.Action icon={<Icon.SignIn size="16" />} link="/sign-in" id="onboarding-sign-in-btn">
            Sign in
          </Header.Action>
        </div>
      </Header.Root>
      <Content.Grid>
        <Typography.Display>Bye bye!</Typography.Display>
        <Typography.Body variant="large" className="text-[22px] sm:text-2xl leading-tight text-opacity-50 mt-2 lg:mt-0">
          You have signed out from Pubky. See you soon!
        </Typography.Body>
        <div className="relative my-6 w-full bg-white bg-opacity-10 rounded-lg flex-col justify-center items-center inline-flex">
          <div className="p-12 flex-col justify-center items-center flex">
            <div className="p-4">
              <Icon.SignOut size="130" />
              <Image alt="glow" fill src="/images/webp/glow-1.webp" />
            </div>
          </div>
        </div>
        <div className="flex-col justify-center items-center flex">
          <Link href="/sign-in" className="w-full sm:w-[154px]" id="logout-link">
            <Button.Large id="sign-back-in-btn" variant="secondary" icon={<Icon.Key size="16" />}>
              Sign back in
            </Button.Large>
          </Link>
        </div>
      </Content.Grid>
    </Content.Main>
  );
}
