import Link from 'next/link';
import { Typography, Button, Icon } from '@social/ui-shared';
import { Onboarding } from '../components';

export default function Paper() {
  return (
    <Onboarding.Layout currentStep={0}>
      <Typography.Display>You just want to be free.</Typography.Display>
      <div className="flex-col inline-flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        <div className="flex flex-col gap-8">
          <Typography.H2 variant="light" className="text-opacity-50">
            If you just stop everything for a moment and breathe in, you will
            realize that our deepest desires, our most profound dreams, all lead
            us to one ultimate destination: freedom.
          </Typography.H2>
          <Typography.H2 variant="light" className="text-opacity-50">
            Yet, we often lose sight of this truth. We chase after money,
            possessions, status, believing these are the ends we seek. But these
            are mere shadows, echoes of a deeper longing. What we truly crave is
            freedom — the freedom to be, to speak, to live without restraint.
          </Typography.H2>
        </div>
        <div className="flex flex-col gap-8">
          <Typography.H2 variant="light" className="text-opacity-50">
            True freedom isn&apos;t bought or sold; it is earned through the
            courage to be ourselves, to speak our truths, to live authentically.
          </Typography.H2>
          <Typography.H2 variant="light" className="text-opacity-50">
            It is the liberty to think, to create, to connect without fear or
            censorship.
          </Typography.H2>
          <Typography.H2 variant="light" className="text-opacity-50">
            It is the sovereignty of not only our money but our minds, our
            bodies, and our digital lives.
          </Typography.H2>
        </div>
        <div className="flex flex-col gap-8">
          <Typography.H2 variant="light" className="text-opacity-50">
            Look around you. Every action, every choice you make is a step
            towards or away from this freedom.
          </Typography.H2>
          <Typography.H2 variant="light" className="text-opacity-50">
            Which way are you heading? It&apos;s time to make a choice.
          </Typography.H2>
          <Typography.H2 variant="light" className="font-semibold">
            Welcome to Pubky.
          </Typography.H2>
          <Typography.H2 variant="light" className="text-opacity-50">
            Your keys, your content, your rules.
          </Typography.H2>
        </div>
        {/**<Content.MainBg alt="Onboard Pubky" imgSrc="/images/bg-image-3.png" />*/}
      </div>
      <div className="w-full max-w-[1200px] mt-6 justify-end items-center inline-flex">
        <Link href="/onboarding/sign-in">
          <Button.Large icon={<Icon.ArrowRight />}>Continue</Button.Large>
        </Link>
      </div>
    </Onboarding.Layout>
  );
}
