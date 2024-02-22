import Image from 'next/image';
import Link from 'next/link';
import { Header, Content, Typography, Button } from '@social/ui-shared';

export default function Index() {
  return (
    <Content.Main background="bg-black">
      <Header.Root>
        <Header.Logo height={48} width={167} />
        <Header.Title title={'Onboarding'} />
      </Header.Root>
      <Content.Grid>
        <Typography.Display>You are the algorithm</Typography.Display>
        <Typography.PageTitle className="text-opacity-50">
          Your keys, your content, your rules. Social content, reimagined.
        </Typography.PageTitle>
        <Link href="/onboarding/step1">
          <Button.Large className="w-80 mt-12 relative z-10">
            Get Started
          </Button.Large>
        </Link>
      </Content.Grid>
      <div className="relative h-screen">
        <Image fill src="/images/background-image.png" alt="background" />
        <Image
          width={768}
          height={768}
          src="/images/explosion.png"
          alt="explosion"
          className="absolute bottom-0 ml-52"
        />
      </div>
    </Content.Main>
  );
}
