import Link from 'next/link';
import Image from 'next/image';
import { Content, Typography, Button, Icon, Card } from '@social/ui-shared';
import { Onboarding } from '../components';

export default function Index() {
  return (
    <Onboarding.Layout currentStep={1}>
      <Typography.Display>Let&apos;s get started</Typography.Display>
      <Typography.PageTitle className="text-opacity-50 mt-4 sm:mt-0">
        Join by scanning a QR with Bitkit, or by creating a new pubky.
      </Typography.PageTitle>
      <div className="w-full flex-col inline-flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        <Card.Primary
          title="Join using Bitkit"
          text="Have Bitkit or another Pubky Core powered wallet? Scan this QR to sign up."
        >
          <Image
            width={320}
            height={320}
            className="mt-6"
            alt="qr"
            src="/images/qr.png"
          />
          <Content.LinksStoreApp />
        </Card.Primary>
        <Card.Primary
          title="New Pubky"
          text="Another option is to create a new account and profile on Pubky itself (less secure)."
        >
          <Image
            width={320}
            height={236}
            alt="visual"
            src="/images/visual.png"
          />
          <Link
            href="/onboarding/sign-up"
            className="mt-4 lg:mt-0"
            id="onboarding-sign-up-link"
          >
            <Button.Large icon={<Icon.UserRectangle />}>New pubky</Button.Large>
          </Link>
        </Card.Primary>
      </div>
      <Content.MainBg alt="Onboard Pubky" imgSrc="/images/bg-image1.png" />
    </Onboarding.Layout>
  );
}
