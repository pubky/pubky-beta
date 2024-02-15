import { Button, Component, Typography } from '@social/ui-shared';

export default async function Index() {
  return (
    <Component.BgImage backgroundColor="bg-black">
      <Component.Header />
      <Component.Grid>
        <Typography.Display>You are the algorithm</Typography.Display>
        <Typography.PageTitle color="text-white text-opacity-50">
          Your keys, your content, your rules. Social content, reimagined.
        </Typography.PageTitle>
          <Button.Large href='/onboarding/step1' width="w-80" styles="mt-12 relative z-10">
            Get Started
          </Button.Large>
      </Component.Grid>
      <div className="relative h-screen">
        <Component.Image
          src="../images/background-image.png"
          alt="background"
          styles="w-full h-full"
        />
        <Component.Image
          src="../images/explosion.png"
          alt="explosion"
          styles="absolute bottom-0 pl-52"
        />
      </div>
    </Component.BgImage>
  );
}
