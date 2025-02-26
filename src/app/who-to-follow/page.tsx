import { Content } from '@social/ui-shared';
import { CreatePost, FooterMobile } from '@/components';
import { getSeoMetadata } from './../../components/HeaderSEO';
import { RecommendedUsers } from './components';

export const metadata = getSeoMetadata({
  title: 'Who to Follow | Pubky.app',
  description: 'Pubky.app - Unlock the web.'
});

export default function Index() {
  return (
    <Content.Main>
      <RecommendedUsers.Header />
      <Content.Grid className="flex gap-6">
        <RecommendedUsers.LeftSidebar />
        <RecommendedUsers.MainContent />
        <RecommendedUsers.RightSidebar />
      </Content.Grid>
      <CreatePost />
      <FooterMobile />
    </Content.Main>
  );
}
