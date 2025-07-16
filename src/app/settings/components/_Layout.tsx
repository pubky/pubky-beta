'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Content } from '@social/ui-shared';
import * as Components from '@/components';
import Menu from '../_menu';
import MenuMobile from '../_menuMobile';
import Faq from '../_faq';
import Version from '../_version';
import { Settings } from '.';
import ToSAndPrivacy from '../_ToS-Privacy';

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [_, setSelectedItem] = useState<string | null>('account');
  const [isHelpSection, setIsHelpSection] = useState(false);

  useEffect(() => {
    if (pathname === '/settings/help') {
      setIsHelpSection(true);
    } else {
      setIsHelpSection(false);
    }
  }, [pathname]);

  return (
    <Content.Main>
      <Settings.Header />
      <Content.Grid className="flex gap-6">
        {/* Sidebar menu */}
        <Components.Sidebar className="w-[280px] hidden lg:block">
          <Menu setSelectedItem={setSelectedItem} />
        </Components.Sidebar>

        {/* Main content (children will be rendered here) */}
        <div className="w-full flex-col inline-flex gap-3">
          <div className="lg:hidden flex">
            <MenuMobile setSelectedItem={setSelectedItem} />
          </div>
          {children}
        </div>

        {/* Sidebar extras */}
        <Components.Sidebar className="w-[280px] hidden xl:block">
          <ToSAndPrivacy />
          {!isHelpSection && <Faq />}
          <div className="self-start sticky top-[120px]">
            <Components.Feedback />
            <Version />
          </div>
        </Components.Sidebar>
      </Content.Grid>
      <Components.CreatePost />
      <Components.FooterMobile />
    </Content.Main>
  );
}
