'use client';

import Link from 'next/link';
import { Header, Content, Typography, Button, Icon } from '@social/ui-shared';
import { useEffect, useState } from 'react';

export default function Index() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <Content.Main>
      <Header.Root className="backdrop-blur-[0px]">
        <Header.Logo link="/" />
        <div className="h-6 justify-start items-start gap-6 inline-flex">
          <Link
            target="_blank"
            href="https://github.com/pubky"
            className="cursor-pointer opacity-30 hover:opacity-100"
          >
            <Icon.Github size="24" />
          </Link>
          <Link
            target="_blank"
            href="https://x.com/getpubky"
            className="cursor-pointer opacity-30 hover:opacity-100"
          >
            <Icon.Twitter size="24" />
          </Link>
          <Link
            target="_blank"
            href="https://www.youtube.com/channel/UCyNruUjynpzvQXNTxbJBLmg"
            className="cursor-pointer opacity-30 hover:opacity-100"
          >
            <Icon.Youtube width="24" height="24" />
          </Link>
        </div>
      </Header.Root>
      <Content.Grid className="relative z-20 xl:mt-14">
        <Typography.Display className="text-7xl sm:text-7xl xl:text-9xl xl:leading-[128px]">
          Unlock <br />
          the web.
        </Typography.Display>
        <Typography.H2 variant="light" className="text-opacity-50 mt-4">
          Your keys, your content, your rules.
        </Typography.H2>
        <div className="relative flex gap-3 mt-12">
          <Link href="/intro">
            <Button.Large
              className="bg-[#c8ff00] border-[#c8ff00]"
              colorText="text-[#c8ff00]"
            >
              Sneak Peek
            </Button.Large>
          </Link>
          <Button.Large
            onClick={() => window.open('https://pubky.org', '_blank')}
            variant="secondary"
            className="w-auto"
          >
            Pubky Core
          </Button.Large>
        </div>
        <Typography.Body
          variant="small"
          className="fixed bottom-12 text-[13.5px] text-opacity-30 font-normal"
        >
          Synonym Software Ltd. ©2024.
        </Typography.Body>
      </Content.Grid>
      <div className="w-full">
        <div
          style={{
            backgroundImage: isMobile
              ? "url('/images/webp/home-mobile.webp')"
              : "url('/images/webp/home.webp')",
            marginTop: isMobile ? '150px' : '',
          }}
          className="fixed inset-0 bg-cover bg-center pointer-events-none"
        />
      </div>
    </Content.Main>
  );
}
