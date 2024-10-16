'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Content, Header } from '@social/ui-shared';
import { usePubkyClientContext } from '@/contexts';

interface LayoutOnboardingProps {
  children: React.ReactNode;
  currentStep?: number;
}

export default function OnboardingLayout({
  children,
  currentStep = 1,
}: LayoutOnboardingProps) {
  const pathname = usePathname();
  const { pubky, isLoggedIn, profile } = usePubkyClientContext();
  const [logoLink, setLogoLink] = useState('/onboarding');

  useEffect(() => {
    async function fetchData() {
      const loggedIn = await isLoggedIn();
      const emptyProfile = profile ? false : true;

      if (!loggedIn || pathname === '/onboarding/welcome') {
        setLogoLink('/onboarding');
      } else {
        setLogoLink('/home');
      }
      if (emptyProfile) {
        setLogoLink('/onboarding/register');
      }
    }
    fetchData();
  }, [pubky, pathname, isLoggedIn]);

  return (
    <Content.Main className="pb-0">
      <Header.Root>
        <Header.Logo link={logoLink} />
        <Header.Title titleHeader={'Onboarding'} />
        <Content.Stepper
          className="w-[50%] lg:w-[70%] xl:w-full hidden sm:flex"
          currentStep={currentStep}
        />
      </Header.Root>
      <Content.Grid>{children}</Content.Grid>
    </Content.Main>
  );
}
