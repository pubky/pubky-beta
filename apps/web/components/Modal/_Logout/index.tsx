'use client';

import { Modal } from '@social/ui-shared';
import { useEffect, useRef } from 'react';
import ContentLogout from './_Content';

interface LogoutProps {
  showModalLogout: boolean;
  setShowModalLogout: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Logout({
  showModalLogout,
  setShowModalLogout,
}: LogoutProps) {
  const modalLogoutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutsideModalLogout = (event: MouseEvent) => {
      if (
        modalLogoutRef.current &&
        !modalLogoutRef.current.contains(event.target as Node)
      ) {
        setShowModalLogout(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutsideModalLogout);

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideModalLogout);
    };
  }, [modalLogoutRef, setShowModalLogout]);

  return (
    <Modal.Root
      show={showModalLogout}
      closeModal={() => setShowModalLogout(false)}
      modalRef={modalLogoutRef}
      className="max-w-[1200px] md:min-w-[588px] max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-webkit"
    >
      <Modal.CloseAction onClick={() => setShowModalLogout(false)} />
      <Modal.Header title="Sign out?" />
      <ContentLogout />
    </Modal.Root>
  );
}
