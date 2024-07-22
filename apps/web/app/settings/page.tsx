'use client';

import { useState } from 'react';
import { Content } from '@social/ui-shared';

import * as Components from '@/components';
import Menu from './_menu';
import { Section } from './sections';
import Faq from './_faq';
import Version from './_version';

export default function Index() {
  const [selectedItem, setSelectedItem] = useState<string | null>('account');

  return (
    <Content.Main>
      <Components.Header className="hidden md:block" title="Settings" />
      <Content.Grid className={'grid grid-cols-5 gap-6'}>
        <Components.Sidebar className="hidden lg:block">
          <Menu selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
        </Components.Sidebar>
        <div
          className={`col-span-5 lg:col-span-4 xl:col-span-3
           flex-col inline-flex gap-3`}
        >
          {selectedItem === 'account' && <Section.Account />}
          {selectedItem === 'notifications' && <Section.Notifications />}
          {selectedItem === 'privacy_safety' && <Section.PrivacySafety />}
          {selectedItem === 'muted_users' && <Section.MutedUsers />}
        </div>
        <Components.Sidebar className="hidden xl:block">
          <Faq />
          <Version />
        </Components.Sidebar>
      </Content.Grid>
    </Content.Main>
  );
}
