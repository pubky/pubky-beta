'use client';

import {
  Button,
  Content as ContentUI,
  Header,
  Typography,
} from '@social/ui-shared';
import { Error404 } from '@/components/404';
import { useRouter } from 'next/navigation';

export default function Content() {
  const router = useRouter();
  return (
    <ContentUI.Main>
      <Header.Root>
        <Header.Logo />
        <Header.Title title="Page not found" />
      </Header.Root>
      <ContentUI.Grid>
        <Typography.Display>Lost in the Rabbit Hole</Typography.Display>
        <Typography.Body
          variant="large"
          className="text-[22px] sm:text-2xl leading-tight text-opacity-50 mt-2 sm:mt-0"
        >
          The page or content you are looking for is not available
        </Typography.Body>
        <div onClick={() => router.back()}>
          <Button.Large className="sm:w-80 w-full mt-6 relative z-10">
            Return back
          </Button.Large>
        </div>
      </ContentUI.Grid>
      <Error404.Root>
        <Error404.Text>404</Error404.Text>
      </Error404.Root>
    </ContentUI.Main>
  );
}
