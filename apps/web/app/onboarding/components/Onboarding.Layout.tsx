import { Content, Header } from '@social/ui-shared';

interface LayoutOnboardingProps {
  children: React.ReactNode;
  currentStep?: number;
}

export default function OnboardingLayout({
  children,
  currentStep = 1,
}: LayoutOnboardingProps) {
  return (
    <Content.Main>
      <Header.Root>
        <Header.Logo />
        <Header.Title title={'Onboarding'} />
        <Content.Stepper
          className="w-[50%] lg:w-[70%] xl:w-full hidden sm:flex"
          currentStep={currentStep}
        />
      </Header.Root>
      <Content.Grid>{children}</Content.Grid>
    </Content.Main>
  );
}
