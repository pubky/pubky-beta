'use client';

import Link from 'next/link';
import { Typography, Button, Icon, Content, Header } from '@social/ui-shared';
import { useEffect, useState } from 'react';
import { usePubkyClientContext } from '@/contexts';

export default function Intro() {
  const { pubky, isLoggedIn } = usePubkyClientContext();
  const [logoLink, setLogoLink] = useState('/onboarding');

  useEffect(() => {
    async function fetchData() {
      const loggedIn = await isLoggedIn();
      if (!loggedIn) {
        setLogoLink('/onboarding');
      } else {
        setLogoLink('/home');
      }
    }
    fetchData();
  }, [pubky, isLoggedIn]);
  return (
    <Content.Main className="pb-0">
      <Header.Root>
        <Header.Logo link={logoLink} />
        <Header.Title titleHeader={'Intro'} />
      </Header.Root>
      <Content.Grid>
        {' '}
        <Typography.Display>You just want to be free.</Typography.Display>
        <div className="flex-col inline-flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          <div className="flex flex-col gap-4">
            <Typography.Body variant="medium" className="text-opacity-50">
              If you just stop everything for a moment and breathe in, you will
              realize that our deepest desires, our most profound dreams, all
              lead us to one ultimate destination: freedom.
            </Typography.Body>
            <Typography.Body variant="medium" className="text-opacity-50">
              Yet, we often lose sight of this truth. We chase after money,
              possessions, status, believing these are the ends we seek. But
              these are mere shadows, echoes of a deeper longing. What we truly
              crave is freedom — the freedom to be, to speak, to live without
              restraint.
            </Typography.Body>
          </div>
          <div className="flex flex-col gap-4">
            <Typography.Body variant="medium" className="text-opacity-50">
              True freedom isn&apos;t bought or sold; it is earned through the
              courage to be ourselves, to speak our truths, to live
              authentically.
            </Typography.Body>
            <Typography.Body variant="medium" className="text-opacity-50">
              It is the liberty to think, to create, to connect without fear or
              censorship.
            </Typography.Body>
            <Typography.Body variant="medium" className="text-opacity-50">
              It is the sovereignty of not only our money but our minds, our
              bodies, and our digital lives.
            </Typography.Body>
          </div>
          <div className="flex flex-col gap-4">
            <Typography.Body variant="medium" className="text-opacity-50">
              Look around you. Every action, every choice you make is a step
              towards or away from this freedom. Which way are you heading?
            </Typography.Body>
            <Typography.Body variant="medium" className="text-opacity-50">
              It&apos;s time to make a choice.
            </Typography.Body>
            <Typography.Body variant="medium" className="font-semibold">
              Welcome to Pubky.
            </Typography.Body>
            <Typography.Body variant="medium" className="text-opacity-50">
              Your keys, your content, your rules.
            </Typography.Body>
          </div>
          {/**<Content.MainBg alt="Onboard Pubky" imgSrc="/images/bg-image-3.png" />*/}
        </div>
        <div className="w-full max-w-[1200px] mt-6 justify-end items-center inline-flex">
          <Link href="/onboarding/sign-in" id="onboarding-sign-in-btn">
            <Button.Large icon={<Icon.ArrowRight />}>Continue</Button.Large>
          </Link>
        </div>
      </Content.Grid>
    </Content.Main>
  );
}
