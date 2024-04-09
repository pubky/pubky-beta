'use client';

import { Content, Header } from '@social/ui-shared';
import { useClientContext } from '../../../contexts/client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface LayoutOnboardingProps {
  children: React.ReactNode;
  currentStep?: number;
}

export default function OnboardingLayout({
  children,
  currentStep = 1,
}: LayoutOnboardingProps) {
  const pathname = usePathname();
  const { pubky, isLoggedIn } = useClientContext();
  const [logoLink, setLogoLink] = useState('/onboarding');

  useEffect(() => {
    async function fetchData() {
      const loggedIn = await isLoggedIn();

      if (!loggedIn || pathname === '/onboarding/welcome') {
        setLogoLink('/onboarding/sign-in');
      } else {
        setLogoLink('/home');
      }
    }
    fetchData();
  }, [pubky, pathname, isLoggedIn]);

  return (
    <Content.Main>
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
