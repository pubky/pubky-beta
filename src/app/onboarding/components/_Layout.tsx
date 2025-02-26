'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Content, Header } from '@social/ui-shared';
import { usePubkyClientContext } from '@/contexts';

interface LayoutOnboardingProps {
  children: React.ReactNode;
  currentStep?: number;
}

export default function OnboardingLayout({ children, currentStep = 1 }: LayoutOnboardingProps) {
  const pathname = usePathname();
  const { pubky, isLoggedIn, profile } = usePubkyClientContext();
  const [logoLink, setLogoLink] = useState('/onboarding');

  useEffect(() => {
    async function fetchData() {
      const loggedIn = await isLoggedIn();
      const emptyProfile = profile ? false : true;

      if (!loggedIn || pathname === '/onboarding/welcome' || emptyProfile) {
        setLogoLink('/onboarding');
      } else {
        setLogoLink('/home');
      }
      //if (emptyProfile) {
      //  setLogoLink('/onboarding/register');
      //}
    }
    fetchData();
  }, [pubky, pathname, isLoggedIn]);

  return (
    <Content.Main className="pb-0 sm:pt-[125px]">
      <Header.Root>
        <div className="flex gap-3 lg:gap-6 w-full sm:w-auto justify-between sm:justify-start items-start">
          <Header.Logo link={logoLink} />
          <Header.Title
            titleHeader="Onboarding"
            className="flex justify-end sm:justify-start self-center sm:self-end mt-1 sm:mt-0"
          />
        </div>
        <Content.Stepper className="w-[50%] lg:w-[70%] xl:w-full ml-6 hidden sm:flex" currentStep={currentStep} />
      </Header.Root>
      <Content.Grid>{children}</Content.Grid>
    </Content.Main>
  );
}
