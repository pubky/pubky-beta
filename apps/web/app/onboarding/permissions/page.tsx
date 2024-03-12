import Link from 'next/link';
import {
  Content,
  Typography,
  Card,
  Button,
  Icon,
  List,
} from '@social/ui-shared';
import { Onboarding } from '../components';

export default function Index() {
  return (
    <Onboarding.Layout currentStep={2}>
      <Typography.Display>Welcome!</Typography.Display>
      <Typography.PageTitle className="text-opacity-50 mt-4 lg:mt-0">
        Allow Pubky to read your profile and contacts for a more seamless
        experience.
      </Typography.PageTitle>
      <div className="w-full flex-col inline-flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        <Card.Primary title="Permissions">
          <List.Primary
            className="mt-6"
            title="Hypekit will be able to:"
            list={[
              'Read your profile',
              'Read your contacts',
              'Read your tags',
              'Read your content',
              'Read payment prefs',
            ]}
          />
          <div className="mt-12">
            <Link href="/onboarding/welcome">
              <Button.Large icon={<Icon.Check />}>
                Accept & Sign in
              </Button.Large>
            </Link>
          </div>
        </Card.Primary>
        <Card.Primary className="justify-start" title="No access">
          <List.Primary
            className="mt-6 tracking-normal sm:tracking-wide"
            title="Hypekit will not be able to:"
            list={['Read your private key', 'Read encrypted content']}
          />
        </Card.Primary>
        <Content.MainBg alt="Onboard Pubky" imgSrc="/images/bg-image-2.png" />
      </div>
    </Onboarding.Layout>
  );
}
