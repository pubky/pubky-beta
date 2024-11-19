import { Content } from '@social/ui-shared';
import { CreatePost, Header, FooterMobile } from '@/components';
import { getSeoMetadata } from './../../components/HeaderSEO';
import { Influencers } from './components/index';

export const metadata = getSeoMetadata({
  title: 'Influencers | Pubky.app',
  description: 'Pubky.app - Unlock the web.',
});

export default function Index() {
  return (
    <Content.Main>
      <Header className="hidden md:block" title="Influencers" />
      <Content.Grid className="grid grid-cols-10 gap-4">
        <Influencers.LeftSidebar />
        <Influencers.MainContent />
        <Influencers.RightSidebar />
      </Content.Grid>
      <CreatePost />
      <FooterMobile title="Influencers" />
    </Content.Main>
  );
}
