'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button, Icon, Typography } from '@social/ui-shared';
import { useClientContext, useToastContext } from '@/contexts';
import { Onboarding } from '../components';

export default function Index() {
  const { pubky } = useClientContext();
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
      <div className="my-6 w-full flex-col justify-center items-center inline-flex">
        <div className="flex-col justify-center items-center flex">
          <Image
            width={284}
            height={284}
            src="/images/pubky.png"
            alt="confirm"
            className="scale-75 sm:scale-100"
          />
          <div className="pb-8 justify-center items-center gap-2.5 inline-flex">
            {pubky ? (
              <Typography.H2 variant="light">pk:{pubky}</Typography.H2>
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
          icon={<Icon.Clipboard />}
          className="w-[250px]"
          variant="secondary"
          onClick={() => {
            setContent(`pk:${pubky}`, 'pubky');
            setShow(true);
            handleCopy();
          }}
        >
          Copy pubky to clipboard
        </Button.Large>
        <Link href="/onboarding/confirm">
          <Button.Large icon={<Icon.ArrowRight />} className="w-[140px] z-20">
            Continue
          </Button.Large>
        </Link>
      </div>
    </Onboarding.Layout>
  );
}
