'use client';

import { Button } from '@social/ui-shared';
import { usePubkyClientContext, useModal } from '@/contexts';
import { useIsMobile } from '@/hooks/useIsMobile';
import useIsScrollup from '@/hooks/useIsScrollUp';

export default function CreatePost() {
  const { pubky } = usePubkyClientContext();
  const isMobile = useIsMobile();
  const { openModal } = useModal();
  const isVisible = useIsScrollup();

  return (
    <div
      className={`flex fixed bottom-[85px] right-5 lg:bottom-10 lg:right-10 z-40 backdrop-blur-md  rounded-[96px] ${
        isMobile && (isVisible ? 'opacity-100' : 'opacity-20')
      }`}
    >
      <Button.Create id="new-post-btn" onClick={() => (pubky ? openModal('createPost') : openModal('join'))} />
    </div>
  );
}
