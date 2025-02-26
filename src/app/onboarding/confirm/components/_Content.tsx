'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button, Icon, Tooltip, Typography } from '@social/ui-shared';
import { Onboarding } from '../../components';
import Image from 'next/image';
import { useModal, usePubkyClientContext } from '@/contexts';

export default function Index() {
  const { seed, mnemonic } = usePubkyClientContext();
  const { openModal } = useModal();
  const [disposableAccount, setDisposableAccount] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    if (seed) {
      setDisposableAccount(true);
    } else {
      setDisposableAccount(false);
    }
  }, [seed]);

  return (
    <Onboarding.Layout currentStep={4}>
      <Typography.Display>Ready to go!</Typography.Display>
      <Typography.Body variant="large" className="text-[22px] sm:text-2xl leading-tight text-opacity-50 mt-2 lg:mt-0">
        Welcome to Pubky. Your keys, your content, your rules.
      </Typography.Body>
      <div className="relative my-6 w-full bg-white bg-opacity-10 rounded-lg flex-col justify-center items-center inline-flex">
        <div className="p-12 flex-col justify-center items-center flex">
          <div className="p-7">
            <Icon.CheckCircle size="130" color="#C8FF00" />
            <Image alt="glow" fill src="/images/webp/glow-2.webp" />
          </div>
        </div>
      </div>
      <Tooltip.RootSmall setShowTooltip={setShowTooltip}>
        <Button.Large
          icon={<Icon.Lock color={disposableAccount ? ' white' : 'gray'} />}
          disabled={!disposableAccount}
          onClick={disposableAccount ? () => openModal('backup') : undefined}
          className="w-auto md:hidden flex mb-12"
          variant="secondary"
        >
          Backup account
        </Button.Large>
        {showTooltip && !seed && !mnemonic && (
          <Tooltip.Small className="md:hidden w-[278px]">
            <Typography.Body variant="small" className="text-opacity-80">
              You have already done the backup,{' '}
              <span className="text-white font-bold text-opacity-100">your recovery file/phrase has been deleted</span>.
            </Typography.Body>
          </Tooltip.Small>
        )}
      </Tooltip.RootSmall>
      <div className="w-full max-w-[1200px] justify-between items-center inline-flex">
        <Link href="/onboarding/pubky">
          <Button.Large icon={<Icon.ArrowLeft />} className="w-[140px]" variant="secondary">
            Back
          </Button.Large>
        </Link>
        <Tooltip.RootSmall setShowTooltip={setShowTooltip}>
          <Button.Large
            icon={<Icon.Lock color={disposableAccount ? ' white' : 'gray'} />}
            disabled={!disposableAccount}
            onClick={disposableAccount ? () => openModal('backup') : undefined}
            className="w-auto hidden md:flex"
            variant="secondary"
          >
            Backup account
          </Button.Large>
          {showTooltip && !seed && !mnemonic && (
            <Tooltip.Small className="hidden md:flex w-[278px]">
              <Typography.Body variant="small" className="text-opacity-80">
                You have already done the backup,{' '}
                <span className="text-white font-bold text-opacity-100">
                  your recovery file/phrase has been deleted
                </span>
                .
              </Typography.Body>
            </Tooltip.Small>
          )}
        </Tooltip.RootSmall>
        <Link href="/home">
          <Button.Large id="onboarding-start-exploring-btn" icon={<Icon.Check />} className="w-[140px] z-20">
            Let&apos;s go!
          </Button.Large>
        </Link>
      </div>
    </Onboarding.Layout>
  );
}
