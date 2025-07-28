import { getSeoMetadata } from '@components/HeaderSEO';
import { Content } from '@social/ui-shared';

import * as Components from '@/components';
import { BookmarksPage } from './components';
import { routeTitleMap } from '@/utils/pageTitles';

const title = routeTitleMap['/bookmarks'];

export const metadata = getSeoMetadata({
  title,
  description: 'Welcome to Pubky.app - Unlock the web.'
});

export default function Index() {
  return (
    <Content.Main className="pb-0 pt-[80px]">
      <BookmarksPage.Header />
      <BookmarksPage.Content />
      <Components.CreatePost />
      <Components.FooterMobile title={title} />
    </Content.Main>
  );
}
