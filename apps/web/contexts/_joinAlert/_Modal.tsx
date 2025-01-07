'use client';

import { Modal } from '@social/ui-shared';
import ContentJoin from './_Content';
import { useEffect, useRef } from 'react';

interface ModalJoinProps {
  isJoinOpen: any;
  setIsJoinOpen: any;
}

export default function ModalJoin({
  isJoinOpen,
  setIsJoinOpen,
}: ModalJoinProps) {
  const joinRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (joinRef.current && !joinRef.current.contains(event.target as Node)) {
        setIsJoinOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [joinRef, setIsJoinOpen]);
  return (
    <Modal.Root
      show={isJoinOpen}
      closeModal={() => setIsJoinOpen(false)}
      modalRef={joinRef}
      className="md:max-w-[792px] max-h-[600px] md:max-h-full overflow-y-auto"
    >
      <Modal.CloseAction onClick={() => setIsJoinOpen(false)} />
      <Modal.Header title="Join Pubky" />
      <ContentJoin closeJoin={() => setIsJoinOpen(false)} />
    </Modal.Root>
  );
}
