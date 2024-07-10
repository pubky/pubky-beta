'use client';

import { Button, Content, Header, Icon, Typography } from '@social/ui-shared';
import { useClientContext } from '@/contexts';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';

export default function Index() {
  const { logout } = useClientContext();

  useEffect(() => {
    async function fetchData() {
      await logout();
    }
    fetchData();
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
        <div className="my-6 w-full flex-col justify-center items-center inline-flex">
          <div className="flex-col justify-center items-center flex">
            <Image
              width={284}
              height={284}
              src="/images/confirm.png"
              alt="confirm"
              className="scale-75 sm:scale-75"
            />
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
