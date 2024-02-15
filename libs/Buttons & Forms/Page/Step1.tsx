import { Button, Component, Icon, Typography } from '@social/ui-shared';

export default async function Index() {
  return (
    <Component.BgImage src="../images/bg-image1.png">
      <Component.Header titlePage="Onboarding">
        <Component.Stepper />
      </Component.Header>
      <Component.Grid height="h-[952px]">
        <Typography.Display>Let’s get started</Typography.Display>
        <Typography.PageTitle color="text-white text-opacity-50">
          Sign in with a QR, download Bitkit, or create a new account.
        </Typography.PageTitle>
        <div className="grid grid-cols-3 gap-6 pt-12">
          <Component.Card
            title="Sign in with Slashtag"
            text="Have Bitkit or a Slashtags powered wallet? Scan this QR to sign in."
          >
            <a href="/onboarding/step2">
              <Component.Image src="../images/QR.png" />
            </a>
          </Component.Card>
          <Component.Card
            title="Portable Profile"
            text="No Slashtags? Download Bitkit and create a portable profile in minutes."
          >
            <Component.LinksStoreApp />
            <div className="pt-[34px]">
              <Button.Large
                href="https://bitkit.to/"
                svg={<Icon.ArrowUpRight />}
              >
                About Bitkit
              </Button.Large>
            </div>
          </Component.Card>
          <Component.Card
            title="New Slashtags Account"
            text="Another option is to create a new Slashtags account with Hypekit."
          >
            <div className="pt-[260px]">
              <Button.Large href="/sign-up" svg={<Icon.UserRectangle />}>
                Create Account
              </Button.Large>
            </div>
          </Component.Card>
        </div>
      </Component.Grid>
    </Component.BgImage>
  );
}