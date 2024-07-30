'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Content } from '@social/ui-shared';
import * as Components from '@/components';
import Menu from './_menu';
import { Section } from './sections';
import Faq from './_faq';
import Version from './_version';

export default function Index() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedItem, setSelectedItem] = useState<string | null>('account');

  useEffect(() => {
    const section = searchParams.get('section');
    if (section) {
      setSelectedItem(section);
    }
  }, [searchParams]);

  useEffect(() => {
    if (selectedItem) {
      router.replace(`/settings?section=${selectedItem}`);
    }
  }, [selectedItem, router]);

  return (
    <Content.Main>
      <Components.Header className="hidden md:block" title="Settings" />
      <Content.Grid className={'grid grid-cols-5 gap-6'}>
        <Components.Sidebar className="hidden lg:block">
          <Menu selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
        </Components.Sidebar>
        <div
          className={`col-span-5 lg:col-span-4 xl:col-span-3 flex-col inline-flex gap-3`}
        >
          {selectedItem === 'account' && <Section.Account />}
          {selectedItem === 'notifications' && <Section.Notifications />}
          {selectedItem === 'wallet' && <Section.Wallet />}
          {selectedItem === 'privacy_safety' && <Section.PrivacySafety />}
          {selectedItem === 'muted_users' && <Section.MutedUsers />}
          {selectedItem === 'language' && <Section.Language />}
          {selectedItem === 'help' && <Section.Help />}
        </div>
        <Components.Sidebar className="hidden xl:block">
          {selectedItem !== 'help' && <Faq />}
          <Version />
        </Components.Sidebar>
      </Content.Grid>
    </Content.Main>
  );
}
