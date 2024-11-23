'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Content } from '@social/ui-shared';
import * as Components from '@/components';
import Menu from '../_menu';
import { Section } from '../sections';
import Faq from '../_faq';
import Version from '../_version';
import MenuMobile from '../_menuMobile';

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
      <Content.Grid className="flex gap-6">
        <Components.Sidebar className="w-[280px] hidden lg:block">
          <Menu selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
        </Components.Sidebar>
        <div className="w-full flex-col inline-flex gap-3">
          <div className="lg:hidden flex">
            <MenuMobile
              selectedItem={selectedItem}
              setSelectedItem={setSelectedItem}
            />
          </div>
          {selectedItem === 'account' && <Section.Account />}
          {selectedItem === 'notifications' && <Section.Notifications />}
          {selectedItem === 'privacy_safety' && <Section.PrivacySafety />}
          {selectedItem === 'muted_users' && <Section.MutedUsers />}
          {selectedItem === 'language' && <Section.Language />}
          {selectedItem === 'help' && <Section.Help />}
        </div>
        <Components.Sidebar className="w-[280px] hidden xl:block">
          {selectedItem !== 'help' && <Faq />}
          <div className="self-start sticky top-[120px]">
            <Components.Feedback />
            <Version />
          </div>
        </Components.Sidebar>
      </Content.Grid>
      <Components.FooterMobile />
    </Content.Main>
  );
}
