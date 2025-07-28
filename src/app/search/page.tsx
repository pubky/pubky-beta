import { getSeoMetadata } from '@components/HeaderSEO';
import { Content } from '@social/ui-shared';
import * as Components from '@/components';
import { SearchPage } from './components';
import { routeTitleMap } from '@/utils/pageTitles';

const title = routeTitleMap['/search'];

export const metadata = getSeoMetadata({
  title,
  description: 'Pubky.app - Unlock the web.'
});

export default function Index() {
  return (
    <Content.Main className="pb-0 pt-[80px]">
      <SearchPage.Header />
      <SearchPage.Content />
      <Components.CreatePost />
      <Components.FooterMobile title={title} />
    </Content.Main>
  );
}
