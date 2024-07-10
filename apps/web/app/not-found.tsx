import { Button, Content, Header, Typography } from '@social/ui-shared';
import Link from 'next/link';
import { Error404 } from '@/components/404';

export default function Custom404() {
  return (
    <Content.Main>
      <Header.Root>
        <Header.Logo />
        <Header.Title title="Page not found" />
      </Header.Root>
      <Content.Grid>
        <Typography.Display>Lost in the Rabbit Hole</Typography.Display>
        <Typography.H2 variant="light" className="text-opacity-50 mt-4 sm:mt-0">
          The page or content you are looking for is not available
        </Typography.H2>
        <Link href="/home">
          <Button.Large className="sm:w-80 w-full mt-12 relative z-10">
            Return home
          </Button.Large>
        </Link>
      </Content.Grid>
      <Error404.Root>
        <Error404.Text>404</Error404.Text>
      </Error404.Root>
    </Content.Main>
  );
}
