'use client';

import { Button, Content, Header, Icon, Typography } from '@social/ui-shared';
import { usePubkyClientContext } from '@/contexts';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect } from 'react';

export default function Index() {
  const { logout } = usePubkyClientContext();

  useEffect(() => {
    async function funcLogout() {
      await logout();
    }
    funcLogout();
  }, [logout]);

  return (
    <Content.Main>
      <Header.Root>
        <Header.Logo />
        <Header.Title titleHeader="Signed out" />
      </Header.Root>
      <Content.Grid>
        <Typography.Display>Bye bye!</Typography.Display>
        <Typography.H2 variant="light" className="text-opacity-50 mt-4 lg:mt-0">
          You have signed out from Pubky. See you soon!
        </Typography.H2>
        <div className="relative my-8 w-full bg-white bg-opacity-10 rounded-lg flex-col justify-center items-center inline-flex">
          <div className="p-12 flex-col justify-center items-center flex">
            <div className="p-12">
              <Icon.SignOut size="130" />
              <Image alt="glow" fill src="/images/glow-1.png" />
            </div>
          </div>
        </div>
        <div className="flex-col justify-center items-center flex">
          <Link
            href="/sign-in"
            className="w-full sm:w-[154px]"
            id="logout-link"
          >
            <Button.Large variant="secondary" icon={<Icon.Key size="16" />}>
              Sign back in
            </Button.Large>
          </Link>
        </div>
      </Content.Grid>
    </Content.Main>
  );
}
