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
  const profile = {
    name: 'Satoshi Nakamoto',
    slashUrl:
      'slash:kwuzt17rxij5e6hi8ukm6ck97obpn4pq8gnaqhxf4g3ehyrpznzy?relay=https://webrelay.slashtags.to',
    image: '/images/user.png',
    info: 'Authored the Bitcoin white paper, developed Bitcoin, mined first block.',
    links: {
      email: 'satoshinakamoto@gmail.com',
      website: 'https://www.satoshinakamoto.com',
      x: '@satoshinakamoto',
    },
  };
  const contacts = [
    {
      image: '/images/user.png',
      name: 'John Carvalho',
      slashUrl:
        'slash:ghnsd17rxij5e6hi8ukm6ck97obpn4pq8gnaqhxf4g3ehyrke3v5?relay=https://webrelay.slashtags.to',
    },
    {
      image: '/images/user.png',
      name: 'John Carvalho',
      slashUrl:
        'slash:ghnsd17rxij5e6hi8ukm6ck97obpn4pq8gnaqhxf4g3ehyrke3v5?relay=https://webrelay.slashtags.to',
    },
    {
      image: '/images/user.png',
      name: 'John Carvalho',
      slashUrl:
        'slash:ghnsd17rxij5e6hi8ukm6ck97obpn4pq8gnaqhxf4g3ehyrke3v5?relay=https://webrelay.slashtags.to',
    },
    {
      image: '/images/user.png',
      name: 'John Carvalho',
      slashUrl:
        'slash:ghnsd17rxij5e6hi8ukm6ck97obpn4pq8gnaqhxf4g3ehyrke3v5?relay=https://webrelay.slashtags.to',
    },
    {
      image: '/images/user.png',
      name: 'John Carvalho',
      slashUrl:
        'slash:ghnsd17rxij5e6hi8ukm6ck97obpn4pq8gnaqhxf4g3ehyrke3v5?relay=https://webrelay.slashtags.to',
    },
  ];
  return (
    <Content.Main>
      <Header.Root>
        <Header.Logo height={48} width={167} />
        <Header.Title title={'Onboarding'} />
        <Content.Stepper currentStep={3} />
      </Header.Root>
      <Content.Grid className="h-[952px]">
        <Typography.Display>Welcome, Satoshi</Typography.Display>
        <Typography.PageTitle className="text-white text-opacity-50">
          Your contacts and profile information are ready to be used in Pubky.
        </Typography.PageTitle>
        <div className="grid grid-cols-3 gap-6 pt-12">
          <Card.Primary>
            <Content.Profile profile={profile} />
          </Card.Primary>
          <Card.Primary title="Contacts">
            <List.Contacts contacts={contacts} />
          </Card.Primary>
          <Card.Primary
            title="Ready to Go!"
            text="Pubky successfully imported your profile and contacts."
          >
            <div className="pt-[365px]">
              <Link href="/onboarding">
                <Button.Large icon={<Icon.Check size="20" />}>
                  Finish
                </Button.Large>
              </Link>
            </div>
          </Card.Primary>
        </div>
      </Content.Grid>
      <Content.MainBg alt="Onboard Pubky" imgSrc="/images/bg-image-3.png" />
    </Content.Main>
  );
}
