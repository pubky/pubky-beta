import Link from 'next/link';
import { Typography, Card, Button, Icon, List } from '@social/ui-shared';
import { Onboarding } from '../../components';

export default function Index() {
  return (
    <Onboarding.Layout currentStep={2}>
      <Typography.Display>Welcome!</Typography.Display>
      <Typography.Body
        variant="large"
        className="text-[22px] sm:text-2xl leading-tight text-opacity-50 mt-2 lg:mt-0"
      >
        Allow Pubky to read your profile and contacts for a more seamless
        experience.
      </Typography.Body>
      <div className="w-full flex-col inline-flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        <Card.Primary title="Permissions">
          <List.Primary
            className="my-6"
            title="Pubky will be able to:"
            list={[
              'Read your profile',
              'Read your contacts',
              'Read your tags',
              'Read your content',
              'Read payment prefs',
            ]}
          />
        </Card.Primary>
        <Card.Primary className="justify-start" title="No access">
          <List.Primary
            className="mt-6 tracking-normal sm:tracking-wide"
            title="Pubky will not be able to:"
            list={['Read your private key', 'Read encrypted content']}
          />
        </Card.Primary>
        <Card.Primary
          className="justify-start"
          title="Be aware"
          text="All content, posts, and profile data you create will be openly available to anyone."
        />
        {/**<Content.MainBg alt="Onboard Pubky" imgSrc="/images/webp/bg-image-2.webp" />*/}
      </div>
      <div className="w-full max-w-[1200px] mt-6 justify-between items-center inline-flex">
        <Link href="/onboarding/sign-in">
          <Button.Large
            icon={<Icon.ArrowLeft />}
            className="w-[140px]"
            variant="secondary"
          >
            Back
          </Button.Large>
        </Link>
        <Link href="/onboarding/welcome">
          <Button.Large icon={<Icon.Check />} className="w-[140px] z-20">
            Accept
          </Button.Large>
        </Link>
      </div>
    </Onboarding.Layout>
  );
}
