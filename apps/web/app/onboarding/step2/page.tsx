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
        <Content.Stepper currentStep={2} />
      </Header.Root>
      <Content.Grid className="h-[952px]">
        <Typography.Display>Welcome!</Typography.Display>
        <Typography.PageTitle className="text-white text-opacity-50">
          Allow Pubky to read your profile and contacts for a more seamless
          experience.
        </Typography.PageTitle>
        <div className="grid grid-cols-3 gap-6 pt-12">
          <Card.Primary title="Permissions">
            <List.Primary
              title="Hypekit will be able to:"
              list={[
                'Read your profile',
                'Read your contacts',
                'Read your tags',
                'Read your content',
                'Read payment prefs',
              ]}
            />
            <div className="pt-12">
              <Link href="/onboarding/step3">
                <Button.Large icon={<Icon.Check size="20" />}>
                  Accept & Sign in
                </Button.Large>
              </Link>
            </div>
          </Card.Primary>
          <Card.Primary title="No access">
            <List.Primary
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
