import { getSeoMetadata } from '@/components/HeaderSEO';
import { Content } from '@social/ui-shared';
import * as Components from '@/components';
import { SearchPage } from './components';

export const metadata = getSeoMetadata({
  title: 'Search | Pubky.app',
  description: 'Pubky.app - Unlock the web.',
});

export default function Index() {
  return (
    <Content.Main>
      <Components.Header className="hidden md:block" title="Search" />
      <SearchPage.Content />
      <Components.CreatePost />
      <Components.FooterMobile title="Search" />
    </Content.Main>
  );
}
