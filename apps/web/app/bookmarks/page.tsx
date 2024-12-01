import { getSeoMetadata } from '@components/HeaderSEO';
import { Content } from '@social/ui-shared';

import * as Components from '@/components';
import { BookmarksPage } from './components';

export const metadata = getSeoMetadata({
  title: 'Bookmarks | Pubky.app',
  description: 'Welcome to Pubky.app - Unlock the web.',
});

export default function Index() {
  return (
    <Content.Main>
      <Components.Header className="hidden md:block" title="Bookmarks" />
      <Components.RemindBackup />
      <BookmarksPage.Content />
      <Components.CreatePost />
      <Components.FooterMobile title="Bookmarks" />
    </Content.Main>
  );
}
