'use client';

import * as Components from '@/components';
import { Timeline } from './_Timeline';
import { usePubkyClientContext } from '@/contexts';
import { useIsMobile } from '@/hooks/useIsMobile';

interface MainContentProps {
  layout: string;
  loadingFeed: boolean;
  setLoadingFeed: React.Dispatch<React.SetStateAction<boolean>>;
  ref?: React.RefObject<HTMLDivElement>;
}

export function MainContent({ layout, loadingFeed, setLoadingFeed, ref }: MainContentProps) {
  const { pubky } = usePubkyClientContext();
  const isMobile = useIsMobile(1280);

  return (
    <Components.PostsLayout ref={ref} id="posts-feed" className="w-full flex-col inline-flex gap-3">
      {pubky && (
        <>
          <Components.CustomFeeds loading={loadingFeed} setLoading={setLoadingFeed} />
          <Components.CreateQuickPost loadingFeed={loadingFeed} largeView={!isMobile && layout === 'wide'} />
        </>
      )}
      <Timeline />
    </Components.PostsLayout>
  );
}
