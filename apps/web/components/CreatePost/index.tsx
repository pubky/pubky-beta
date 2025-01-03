'use client';

import { Button } from '@social/ui-shared';
import { useEffect, useRef, useState } from 'react';
import { Modal } from '../Modal';
import { usePubkyClientContext, useJoinModal } from '@/contexts';

export default function CreatePost() {
  const { pubky } = usePubkyClientContext();
  const { openJoinModal } = useJoinModal();
  const [showModalPost, setShowModalPost] = useState(false);
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
      <div className="hidden lg:flex fixed bottom-5 right-5 sm:bottom-10 sm:right-10 z-50">
        <Button.Create
          id="new-post-btn"
          onClick={() => (pubky ? setShowModalPost(true) : openJoinModal())}
        />
      </div>

      <Modal.CreatePost
        showModalPost={showModalPost}
        setShowModalPost={setShowModalPost}
        modalPostRef={modalPostRef}
      />
    </>
  );
}
