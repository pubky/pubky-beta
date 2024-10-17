import { Typography } from '@social/ui-shared';
import { Onboarding } from '../components';
import { Card } from './Card';

export default function Index() {
  return (
    <Onboarding.Layout currentStep={1}>
      <Typography.Display>Let&apos;s get started</Typography.Display>
      <Typography.H2 variant="light" className="text-opacity-50 mt-4 sm:mt-0">
        Join by scanning a QR with Bitkit, or by creating a new pubky.
      </Typography.H2>
      <div className="w-full flex-col inline-flex sm:grid sm:grid-cols-2 lg:grid-cols-8 gap-6 mt-6">
        <Card.Join />
        <Card.NewAccount />
        <Card.SigninBack />
      </div>
      {/**<Content.MainBg alt="Onboard Pubky" imgSrc="/images/bg-image1.png" />*/}
    </Onboarding.Layout>
  );
}
