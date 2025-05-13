'use client';

import Link from 'next/link';
import { Button, Icon, Typography } from '@social/ui-shared';
import { usePubkyClientContext, useToastContext } from '@/contexts';
import { Onboarding } from '../../components';
import Image from 'next/image';

export default function Index() {
  const { pubky } = usePubkyClientContext();
  const { addToast } = useToastContext();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`pk:${pubky}`);
    } catch (error) {
      console.log('Failed to copy: ', error);
    }
  };

  return (
    <Onboarding.Layout currentStep={3}>
      <Typography.Display>Your pubky.</Typography.Display>
      <Typography.Body variant="large" className="text-[22px] sm:text-2xl leading-tight text-opacity-50 mt-2 lg:mt-0">
        Share your pubky with your friends so they can follow you.
      </Typography.Body>
      <div className="relative my-6 w-full bg-white bg-opacity-10 rounded-lg flex-col justify-center items-center inline-flex">
        <div className="p-12 flex-col justify-center items-center flex">
          <div className="p-12">
            <Icon.Key size="130" />
            <Image alt="glow" fill src="/images/webp/glow-1.webp" />
          </div>
          <div className="justify-center items-center gap-2.5 inline-flex">
            {pubky ? (
              <Typography.H2
                id="onboarding-pubky"
                className="break-words text-[13px] lg:text-2xl font-semibold uppercase"
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
      <Button.Large
        icon={<Icon.Clipboard size="16" />}
        className="w-[250px] flex md:hidden mb-12"
        variant="secondary"
        onClick={() => {
          addToast(`pk:${pubky}`, 'pubky');
          handleCopy();
        }}
      >
        Copy pubky to clipboard
      </Button.Large>
      <div className="w-full max-w-[1200px] justify-between items-center inline-flex">
        <Link href="/logout">
          <Button.Large icon={<Icon.SignOut size="16" />} className="w-[140px]" variant="secondary">
            Sign out
          </Button.Large>
        </Link>
        <Button.Large
          id="onboarding-copy-pubky-btn"
          icon={<Icon.Clipboard size="16" />}
          className="w-[250px] hidden md:flex"
          variant="secondary"
          onClick={() => {
            addToast(`pk:${pubky}`, 'pubky');
            handleCopy();
          }}
        >
          Copy pubky to clipboard
        </Button.Large>
        <Link href={'/onboarding/confirm'}>
          <Button.Large id="onboarding-confirm-link" icon={<Icon.ArrowRight />} className="w-[140px] z-20">
            Continue
          </Button.Large>
        </Link>
      </div>
    </Onboarding.Layout>
  );
}
