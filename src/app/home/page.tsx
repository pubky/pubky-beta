import { getSeoMetadata } from '@components/HeaderSEO';
import { Content } from '@social/ui-shared';
import { HomePage } from './components/index';
import * as Components from '@/components';

export const metadata = getSeoMetadata({
  title: 'Home | Pubky.app',
  description: 'Welcome to Pubky.app - Unlock the web.'
});

export default function Index() {
  return (
    <Content.Main className="pb-0 pt-[80px]">
      <HomePage.Header />
      <Components.RemindBackup />
      <HomePage.Content />
      <Components.CreatePost />
      <Components.FooterMobile title="Home" />
    </Content.Main>
  );
}
