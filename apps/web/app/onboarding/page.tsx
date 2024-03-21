import Link from 'next/link';
import Image from 'next/image';
import { Header, Content, Typography, Button } from '@social/ui-shared';

export default function Index() {
  return (
    <Content.Main background="bg-black" className="pb-0">
      <Header.Root>
        <Header.Logo />
        <Header.Title />
      </Header.Root>
      <Content.Grid>
        <Typography.Display>You are the algorithm</Typography.Display>
        <Typography.PageTitle className="text-opacity-50 mt-4 sm:mt-0">
          Your keys, your content, your rules. Social content, re-imagined.
        </Typography.PageTitle>
        <div className="relative">
          <Link href="/onboarding/sign-in">
            <Button.Large className="sm:w-80 w-full mt-12 relative z-20">
              Get Started
            </Button.Large>
          </Link>
          <Image
            src="/images/explosion.png"
            alt="explosion"
            width={768}
            height={768}
            className="absolute mt-10 sm:mt-0 xl:right-96 xl:top-14 z-10"
          />
        </div>
      </Content.Grid>
      <div className="relative h-screen overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-[url('/images/background-image.png')]" />
      </div>
    </Content.Main>
  );
}
