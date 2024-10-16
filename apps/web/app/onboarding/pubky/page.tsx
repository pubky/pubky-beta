'use client';

import Link from 'next/link';
import { Button, Icon, Typography } from '@social/ui-shared';
import { usePubkyClientContext, useToastContext } from '@/contexts';
import { Onboarding } from '../components';
import Image from 'next/image';

export default function Index() {
  const { pubky } = usePubkyClientContext();
  const { setContent, setShow } = useToastContext();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`pk:${pubky}`);
    } catch (error) {
      console.log('Failed to copy: ', error);
    }
  };

  return (
    <Onboarding.Layout currentStep={3}>
      <Typography.Display>Your pubky</Typography.Display>
      <Typography.H2 variant="light" className="text-opacity-50 mt-4 lg:mt-0">
        Share your pubky with your friends so they can follow you.
      </Typography.H2>
      <div className="relative my-8 w-full bg-white bg-opacity-10 rounded-lg flex-col justify-center items-center inline-flex">
        <div className="p-12 flex-col justify-center items-center flex">
          <div className="p-12">
            <Icon.Key size="130" />
            <Image alt="glow" fill src="/images/glow-1.png" />
          </div>
          <div className="justify-center items-center gap-2.5 inline-flex">
            {pubky ? (
              <Typography.H2
                id="onboarding-pubky"
                className="break-all lg:text-[31px] font-light"
                variant="light"
              >
                pk:{pubky}
              </Typography.H2>
            ) : (
              <Icon.LoadingSpin />
            )}
          </div>
        </div>
      </div>
      <div className="w-full max-w-[1200px] justify-between items-center inline-flex">
        <Link href="/onboarding/sign-up">
          <Button.Large
            icon={<Icon.ArrowLeft />}
            className="w-[140px]"
            variant="secondary"
          >
            Back
          </Button.Large>
        </Link>
        <Button.Large
          id="onboarding-copy-pubky-btn"
          icon={<Icon.Clipboard />}
          className="w-[250px] hidden md:flex"
          variant="secondary"
          onClick={() => {
            setContent(`pk:${pubky}`, 'pubky');
            setShow(true);
            handleCopy();
          }}
        >
          Copy pubky to clipboard
        </Button.Large>
        <Link id="onboarding-confirm-link" href="/onboarding/confirm">
          <Button.Large icon={<Icon.ArrowRight />} className="w-[140px] z-20">
            Continue
          </Button.Large>
        </Link>
      </div>
    </Onboarding.Layout>
  );
}
