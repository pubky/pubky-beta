'use client';

import { Button, Content, Header, Icon, Typography } from '@social/ui-shared';
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
          <Link href="/sign-in" className="w-full sm:w-80" id="logout-link">
            <Button.Large icon={<Icon.Key size="16" />}>
              Sign in again
            </Button.Large>
          </Link>
        </div>
      </Content.Grid>
    </Content.Main>
  );
}
