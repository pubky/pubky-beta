import { Content } from '@social/ui-shared';
import { CreatePost, Header } from '../components';
import { HotTags } from './components';

export default function Index() {
  const images = [
    {
      alt: '1',
      src: '/images/user.png',
    },
    {
      alt: '2',
      src: '/images/user.png',
    },
    {
      alt: '3',
      src: '/images/user.png',
    },
    {
      alt: '4',
      src: '/images/user.png',
    },
    {
      alt: '5',
      src: '/images/user.png',
    },
  ];
  return (
    <Content.Main>
      <Header className="w-52 xl:w-36 hidden md:block" title="Hot Tags" />
      <HotTags.Filter />
      <Content.Grid className="flex-col flex gap-3">
        <HotTags.Rank
          rank={1}
          tag="#Bitcoin"
          color="amber"
          counter="317 posts"
          images={images}
        />
        <HotTags.Rank
          rank={2}
          tag="#Keys"
          color="blue"
          counter="197 posts"
          images={images}
        />
      </Content.Grid>
      <CreatePost />
    </Content.Main>
  );
}
