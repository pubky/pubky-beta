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
  return (
    <Components.PostsLayout
      id="posts-feed"
      className="w-full flex-col inline-flex gap-3"
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
