'use client';

import { Typography } from '@social/ui-shared';
import { Onboarding } from '../../components';
import { Card } from '../Card';
import { useModal } from '@/contexts';

export default function Index() {
  const { openModal } = useModal();

  return (
    <Onboarding.Layout currentStep={1}>
      <Typography.Display>
        Let&apos;s{' '}
        <span className="sm:hidden">
          <br />
        </span>{' '}
        get started
      </Typography.Display>
      <Typography.Body variant="large" className="text-[22px] sm:text-2xl leading-tight text-opacity-50 mt-4 sm:mt-0">
        By signing up, you agree to the{' '}
        <span className="cursor-pointer text-[#C8FF00]" onClick={() => openModal('termsOfService')}>
          Terms of Service,
        </span>{' '}
        <span className="cursor-pointer text-[#C8FF00]" onClick={() => openModal('privacyPolicy')}>
          Privacy Policy,
        </span>{' '}
        and you confirm you are{' '}
        <span className="cursor-pointer text-[#C8FF00]" onClick={() => openModal('minimumAge')}>
          over 18 years old
        </span>
        .
      </Typography.Body>
      <div className="w-full flex-col inline-flex xl:grid sm:grid-cols-2 xl:grid-cols-8 gap-6 mt-6">
        <Card.Join />
        <Card.NewAccount />
        <Card.SigninBack />
      </div>
      {/**<Content.MainBg alt="Onboard Pubky" imgSrc="/images/webp/bg-image1.webp" />*/}
    </Onboarding.Layout>
  );
}
