import * as Components from '@/components';
import { Timeline } from './_Timeline';
import { ICustomFeed } from '@/types';

interface MainContentProps {
  layout: string;
  selectedFeed: ICustomFeed | undefined;
  setSelectedFeed: (feed: ICustomFeed | undefined) => void;
  loadingFeed: boolean;
  setLoadingFeed: React.Dispatch<React.SetStateAction<boolean>>;
}

export function MainContent({
  layout,
  selectedFeed,
  setSelectedFeed,
  loadingFeed,
  setLoadingFeed,
}: MainContentProps) {
  const getPostsLayoutClass = (layout: string) => {
    return layout === 'wide'
      ? 'col-span-10'
      : 'col-span-10 lg:col-span-8 xl:col-span-6';
  };

  return (
    <Components.PostsLayout
      id="posts-feed"
      className={`${getPostsLayoutClass(
        layout,
      )} flex-col inline-flex gap-3 lg:ml-[0px] xl:ml-[0px]`}
    >
      <Components.CustomFeeds
        selectedFeed={selectedFeed}
        setSelectedFeed={(setState) => {
          if (typeof setState === 'function') {
            setSelectedFeed(undefined);
          } else {
            setSelectedFeed(setState);
          }
        }}
        loading={loadingFeed}
        setLoading={setLoadingFeed}
      />
      <Components.CreateQuickPost
        loadingFeed={loadingFeed}
        largeView={layout === 'wide'}
      />
      <Timeline selectedFeed={selectedFeed} loadingFeed={loadingFeed} />
    </Components.PostsLayout>
  );
}
