import Link from 'next/link';
import { Header, Content, Typography, Button } from '@social/ui-shared';

export default function Index() {
  return (
    <>
      <Content.Main>
        <Header.Root>
          <Header.Logo />
          <Header.Title title={'Onboarding'} />
        </Header.Root>
        <Content.Grid>
          <Typography.Display>You are the algorithm</Typography.Display>
          <Typography.PageTitle className="text-opacity-50">
            Your keys, your content, your rules. Social content, re-imagined.
          </Typography.PageTitle>
          <Link href="/onboarding/step1">
            <Button.Large className="w-80 mt-12 relative z-10">
              Get Started
            </Button.Large>
          </Link>
        </Content.Grid>
        {/* <div className="absolute top-0 w-full h-full bg-[url('/images/background-image.png')] bg-no-repeat bg-bottom bg-contain" />
        <div className="absolute top-0 w-full h-full bg-[url('/images/explosion.png')] bg-no-repeat" /> */}
      </Content.Main>
    </>
  );
}
