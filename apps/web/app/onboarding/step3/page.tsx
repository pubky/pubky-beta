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
    <Onboarding.Layout currentStep={3}>
      <Typography.Display>Welcome, Satoshi</Typography.Display>
      <Typography.PageTitle className="text-opacity-50">
        Your contacts and profile information are ready to be used in Pubky.
      </Typography.PageTitle>
      <div className="grid grid-cols-3 gap-6 mt-12">
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
          <Link href="/home">
            <Button.Large icon={<Icon.Check />}>Finish</Button.Large>
          </Link>
        </Card.Primary>
        <Content.MainBg alt="Onboard Pubky" imgSrc="/images/bg-image-3.png" />
      </div>
    </Onboarding.Layout>
  );
}
