import Image from 'next/image';
import Link from 'next/link';
import {
  Header,
  Content,
  Typography,
  Button,
  Icon,
  Card,
} from '@social/ui-shared';

export default function Index() {
  return (
    <Content.Main>
      <Header.Root>
        <Header.Logo height={48} width={167} />
        <Header.Title title={'Onboarding'} />
        <Content.Stepper className="w-[785px]" />
      </Header.Root>
      <Content.Grid className="h-[1000px]">
        <Typography.Display>Let&apos;s get started</Typography.Display>
        <Typography.PageTitle className="text-opacity-50">
          Sign in with a QR, download Bitkit, or create a new account.
        </Typography.PageTitle>
        <div className="grid grid-cols-3 gap-6 mt-12">
          <Card.Primary
            title="Sign in with Slashtag"
            text="Have Bitkit or a Slashtags powered wallet? Scan this QR to sign in."
          >
            <Link href="/onboarding/step2">
              <Image
                width={320}
                height={320}
                className="mt-6"
                alt="qr"
                src="/images/QR.png"
              />
            </Link>
          </Card.Primary>
          <Card.Primary
            title="Portable Profile"
            text="No Slashtags? Download Bitkit and create a portable profile in minutes."
          >
            <Content.LinksStoreApp />
            <Link href="https://bitkit.to/">
              <Button.Large icon={<Icon.ArrowUpRight />}>
                About Bitkit
              </Button.Large>
            </Link>
          </Card.Primary>
          <Card.Primary
            title="New Slashtags Account"
            text="Another option is to create a new Slashtags account with Hypekit."
          >
            <Link href="/sign-up">
              <Button.Large icon={<Icon.UserRectangle />}>
                Create Account
              </Button.Large>
            </Link>
          </Card.Primary>
        </div>
      </Content.Grid>
      <Content.MainBg alt="Onboard Pubky" imgSrc="/images/bg-image1.png" />
    </Content.Main>
  );
}
