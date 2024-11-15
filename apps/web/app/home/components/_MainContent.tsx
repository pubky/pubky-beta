
import * as Components from '@/components';
import { Timeline } from './_Timeline';
import { ICustomFeed } from '@/types';

interface MainContentProps {
  layout: string;
  selectedFeed: ICustomFeed | undefined;
  setSelectedFeed: (feed: ICustomFeed | undefined) => void;
}

export function MainContent({ layout, selectedFeed, setSelectedFeed }: MainContentProps) {
  const getPostsLayoutClass = (layout: string) => {
    return layout === 'wide'
      ? 'col-span-10'
      : 'col-span-10 lg:col-span-9 xl:col-span-7';
  };

  return (
    <Components.PostsLayout
      id="posts-feed"
      className={`${getPostsLayoutClass(layout)} flex-col inline-flex gap-3 lg:ml-[70px] xl:ml-[45px]`}
    >
      <Components.CustomFeeds
        selectedFeed={selectedFeed}
        setSelectedFeed={setState => {
          if (typeof setState === 'function') {
            setSelectedFeed(undefined);
          } else {
            setSelectedFeed(setState);
          }
        }}
      />
      <Components.CreateQuickPost largeView={layout === 'wide'} />
      <Timeline selectedFeed={selectedFeed} />
    </Components.PostsLayout>
  );
}
