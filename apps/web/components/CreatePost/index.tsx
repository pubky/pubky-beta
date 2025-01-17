'use client';

import { Button } from '@social/ui-shared';
import { useEffect, useRef, useState } from 'react';
import { Modal } from '../Modal';
import { usePubkyClientContext, useJoin } from '@/contexts';
import { useIsMobile } from '@/hooks/useIsMobile';
import { BottomSheet } from '../BottomSheet';

export default function CreatePost() {
  const { pubky } = usePubkyClientContext();
  const isMobile = useIsMobile();
  const { openJoin } = useJoin();
  const [showModalPost, setShowModalPost] = useState(false);
  const [showSheetPost, setShowSheetPost] = useState(false);
  const modalPostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutsideModals = (event: MouseEvent) => {
      if (
        modalPostRef.current &&
        !modalPostRef.current.contains(event.target as Node)
      ) {
        setShowModalPost(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutsideModals);

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideModals);
    };
  }, [modalPostRef]);

  return (
    <>
      <div className="flex fixed bottom-24 right-5 lg:bottom-10 lg:right-10 z-40 backdrop-blur-2xl rounded-[96px]">
        <Button.Create
          id="new-post-btn"
          onClick={() =>
            pubky
              ? isMobile
                ? setShowSheetPost(true)
                : setShowModalPost(true)
              : openJoin()
          }
        />
      </div>

      <BottomSheet.CreatePost show={showSheetPost} setShow={setShowSheetPost} />
      <Modal.CreatePost
        showModalPost={showModalPost}
        setShowModalPost={setShowModalPost}
        modalPostRef={modalPostRef}
      />
    </>
  );
}
