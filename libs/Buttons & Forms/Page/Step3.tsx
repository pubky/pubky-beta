import { Button, Component, Icon, Typography } from '@social/ui-shared';
export default async function Index() {
  return (
    <Component.BgImage src="../images/bg-image-3.png">
      <Component.Header titlePage="Onboarding">
        <Component.Stepper currentStep={3} />
      </Component.Header>
      <Component.Grid height="h-[952px]">
        <Typography.Display>Welcome, Satoshi</Typography.Display>
        <Typography.PageTitle color="text-white text-opacity-50">
          Your contacts and profile information are ready to be used in Hypekit.
        </Typography.PageTitle>
        <div className="grid grid-cols-3 gap-6 pt-12">
          <Component.Card>
            <Component.Profileinfo
              profile={{
                name: 'Satoshi Nakamoto',
                slashUrl:
                  'slash:kwuzt17rxij5e6hi8ukm6ck97obpn4pq8gnaqhxf4g3ehyrpznzy?relay=https://webrelay.slashtags.to',
                image: 'https://www.weusecoins.com/images/satoshi-nakamoto.png',
                info: 'Authored the Bitcoin white paper, developed Bitcoin, mined first block.',
                links: {
                  email: 'satoshinakamoto@gmail.com',
                  webiste: 'https://www.satoshinakamoto.com',
                  x: '@satoshinakamoto',
                },
              }}
            />
          </Component.Card>
          <Component.Card title="Contacts">
            <Component.ContactsList
              contacts={[
                {
                  image:
                    'https://www.weusecoins.com/images/satoshi-nakamoto.png',
                  name: 'John Carvalho',
                  slashUrl:
                    'slash:ghnsd17rxij5e6hi8ukm6ck97obpn4pq8gnaqhxf4g3ehyrke3v5?relay=https://webrelay.slashtags.to',
                },
                {
                  image:
                    'https://www.weusecoins.com/images/satoshi-nakamoto.png',
                  name: 'John Carvalho',
                  slashUrl:
                    'slash:ghnsd17rxij5e6hi8ukm6ck97obpn4pq8gnaqhxf4g3ehyrke3v5?relay=https://webrelay.slashtags.to',
                },
                {
                  image:
                    'https://www.weusecoins.com/images/satoshi-nakamoto.png',
                  name: 'John Carvalho',
                  slashUrl:
                    'slash:ghnsd17rxij5e6hi8ukm6ck97obpn4pq8gnaqhxf4g3ehyrke3v5?relay=https://webrelay.slashtags.to',
                },
                {
                  image:
                    'https://www.weusecoins.com/images/satoshi-nakamoto.png',
                  name: 'John Carvalho',
                  slashUrl:
                    'slash:ghnsd17rxij5e6hi8ukm6ck97obpn4pq8gnaqhxf4g3ehyrke3v5?relay=https://webrelay.slashtags.to',
                },
                {
                  image:
                    'https://www.weusecoins.com/images/satoshi-nakamoto.png',
                  name: 'John Carvalho',
                  slashUrl:
                    'slash:ghnsd17rxij5e6hi8ukm6ck97obpn4pq8gnaqhxf4g3ehyrke3v5?relay=https://webrelay.slashtags.to',
                },
              ]}
            />
          </Component.Card>
          <Component.Card
            title="Ready to Go!"
            text="Hypekit successfully imported your profile and contacts."
          >
            <div className="pt-[365px]">
              <Button.Large svg={<Icon.Check />}>Finish</Button.Large>
            </div>
          </Component.Card>
        </div>
      </Component.Grid>
    </Component.BgImage>
  );
}
