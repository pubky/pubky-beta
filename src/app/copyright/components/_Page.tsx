'use client';

import { Content as ContentUI, Header } from '@social/ui-shared';
import { usePubkyClientContext } from '@/contexts';
import Content from './_Content';

export default function Index() {
  const { pubky } = usePubkyClientContext();

  return (
    <ContentUI.Main className="sm:pt-[125px]">
      <Header.Root>
        <div className="flex gap-3 lg:gap-6 w-full justify-between sm:justify-start items-center sm:items-start">
          <Header.Logo link={pubky ? '/home' : '/onboarding'} />
        </div>
      </Header.Root>
      <ContentUI.Grid>
        <Content />
      </ContentUI.Grid>
    </ContentUI.Main>
  );
}
