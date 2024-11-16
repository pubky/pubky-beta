import { getSeoMetadata } from './../../components/HeaderSEO';
import { Content } from '@social/ui-shared';
import { HomePage } from './components/index';
import * as Components from '@/components';

export const metadata = getSeoMetadata({
  title: 'Home | Pubky.app',
  description: 'Welcome to Pubky.app - Unlock the web.',
});

export default function Index() {
  return (
    <Content.Main>
      <Components.Header className="hidden md:block" title="Feed" />
      <Components.RemindBackup />
      <HomePage.Content />
      <Components.CreatePost />
      <Components.FooterMobile title="Feed" />
    </Content.Main>
  );
}
