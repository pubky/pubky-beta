'use client';

import * as Components from '@/components';
import { Timeline } from './_Timeline';
import { usePubkyClientContext } from '@/contexts';
import { useIsMobile } from '@/hooks/useIsMobile';

interface MainContentProps {
  layout: string;
  ref?: React.RefObject<HTMLDivElement>;
}

export function MainContent({ layout, ref }: MainContentProps) {
  const { pubky } = usePubkyClientContext();
  const isMobile = useIsMobile(1280);

  return (
    <Components.PostsLayout ref={ref} id="posts-feed" className="w-full flex-col inline-flex gap-3">
      {pubky && <Components.CreateQuickPost largeView={!isMobile && layout === 'wide'} />}
      <Timeline />
    </Components.PostsLayout>
  );
}
