'use client';

import { Button, Content, Header, Icon, Typography } from '@social/ui-shared';
import { usePubkyClientContext } from '@/contexts';
import Link from 'next/link';
import Image from 'next/image';

export default function Index() {
  const { logout } = usePubkyClientContext();

  logout();

  return (
    <Content.Main className="sm:pt-[125px]">
      <Header.Root>
        <Header.Logo link='/onboarding' />
        <Header.Title titleHeader="Signed out" />
      </Header.Root>
      <Content.Grid>
        <Typography.Display>Bye bye!</Typography.Display>
        <Typography.Body
          variant="large"
          className="text-[22px] sm:text-2xl leading-tight text-opacity-50 mt-2 lg:mt-0"
        >
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
