'use client';

import { Button } from '@social/ui-shared';
import { useEffect, useRef, useState } from 'react';
import { Modal } from './Modal';

export default function CreatePost() {
  const [showModalPost, setShowModalPost] = useState(false);
  const modalPostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutsideModalPost = (event: MouseEvent) => {
      if (
        modalPostRef.current &&
        !modalPostRef.current.contains(event.target as Node)
      ) {
        setShowModalPost(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutsideModalPost);

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideModalPost);
    };
  }, [modalPostRef]);

  return (
    <>
      <div className="fixed bottom-5 right-5 sm:bottom-10 sm:right-10">
        <Button.Create onClick={() => setShowModalPost(true)} />
      </div>

      <Modal.CreatePost
        showModalPost={showModalPost}
        setShowModalPost={setShowModalPost}
        modalPostRef={modalPostRef}
      />
    </>
  );
}
