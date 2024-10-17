'use client';

import { Button, Content, Header, Typography } from '@social/ui-shared';
import { useRouter } from 'next/navigation';
import Error404 from './components/404';

export default function Custom404() {
  const router = useRouter();
  return (
    <Content.Main>
      <Header.Root>
        <Header.Logo link="/" />
        <Header.Title title="Page not found" />
      </Header.Root>
      <Content.Grid>
        <Typography.Display>Lost in the Rabbit Hole</Typography.Display>
        <Typography.H2 variant="light" className="text-opacity-50 mt-4 sm:mt-0">
          The page or content you are looking for is not available
        </Typography.H2>
        <div onClick={() => router.back()}>
          <Button.Large className="sm:w-80 w-full mt-6 relative z-10">
            Return back
          </Button.Large>
        </div>
      </Content.Grid>
      <Error404.Root>
        <Error404.Text>404</Error404.Text>
      </Error404.Root>
    </Content.Main>
  );
}
