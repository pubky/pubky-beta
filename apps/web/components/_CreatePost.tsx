'use client';

import { Button } from '@social/ui-shared';
import { useEffect, useRef, useState } from 'react';
import { Modal } from './Modal';

export default function CreatePost() {
  const [showModalPost, setShowModalPost] = useState(false);
  const [showModalLink, setShowModalLink] = useState(false);
  const modalPostRef = useRef<HTMLDivElement>(null);
  const modalLinkRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutsideModals = (event: MouseEvent) => {
      if (
        modalLinkRef.current &&
        !modalLinkRef.current.contains(event.target as Node)
      ) {
        setShowModalLink(false);
      } else if (
        !showModalLink &&
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
  }, [modalPostRef, modalLinkRef, showModalLink]);

  return (
    <>
      <div className="fixed bottom-5 right-5 sm:bottom-10 sm:right-10">
        <Button.Create onClick={() => setShowModalPost(true)} />
      </div>

      <Modal.CreatePost
        showModalPost={showModalPost}
        setShowModalPost={setShowModalPost}
        modalPostRef={modalPostRef}
        setShowModalLink={setShowModalLink}
      />
      <Modal.Link
        showModalLink={showModalLink}
        setShowModalLink={setShowModalLink}
        modalLinkRef={modalLinkRef}
        onAddLink={() => {
          setShowModalLink(false);
          setShowModalPost(true);
        }}
      />
    </>
  );
}
