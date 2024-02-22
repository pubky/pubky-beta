import Link from 'next/link';
import {
  Header,
  Content,
  Typography,
  Card,
  Button,
  Icon,
  List,
} from '@social/ui-shared';

export default function Index() {
  return (
    <Content.Main>
      <Header.Root>
        <Header.Logo height={48} width={167} />
        <Header.Title title={'Onboarding'} />
        <Content.Stepper currentStep={2} className="w-[785px]" />
      </Header.Root>
      <Content.Grid className="h-[1000px]">
        <Typography.Display>Welcome!</Typography.Display>
        <Typography.PageTitle className="text-opacity-50">
          Allow Pubky to read your profile and contacts for a more seamless
          experience.
        </Typography.PageTitle>
        <div className="grid grid-cols-3 gap-6 mt-12">
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
              <Link href="/onboarding/step3">
                <Button.Large icon={<Icon.Check />}>
                  Accept & Sign in
                </Button.Large>
              </Link>
            </div>
          </Card.Primary>
          <Card.Primary className="justify-start" title="No access">
            <List.Primary
              className="mt-6"
              title="Hypekit will not be able to:"
              list={['Read your private key', 'Read encrypted content']}
            />
          </Card.Primary>
        </div>
      </Content.Grid>
      <Content.MainBg alt="Onboard Pubky" imgSrc="/images/bg-image-2.png" />
    </Content.Main>
  );
}
