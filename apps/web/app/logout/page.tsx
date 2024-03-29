'use client';

import { Button, Content, Header, Typography } from '@social/ui-shared';
import { useClientContext } from '../../contexts/client';
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
        <Header.Title />
      </Header.Root>
      <Content.Grid>
        <Typography.Display>Bye bye!</Typography.Display>
        <Typography.PageTitle className="text-opacity-50 mt-4 lg:mt-0">
          You have successfully logged out.
        </Typography.PageTitle>
        <div className="w-full h-[434px] sm:h-[534px] justify-center items-center inline-flex">
          <Image
            width={384}
            height={384}
            src="/images/confirm.png"
            alt="confirm"
            className="scale-75 sm:scale-100"
          />
        </div>
        <div className="flex-col justify-center items-center flex">
          <Link href="/onboarding/sign-in" className="w-full sm:w-80">
            <Button.Large>Sign in again</Button.Large>
          </Link>
        </div>
      </Content.Grid>
    </Content.Main>
  );
}
