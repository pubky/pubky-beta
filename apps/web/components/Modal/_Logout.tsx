'use client';

import { Button, Icon, Modal, Typography } from '@social/ui-shared';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

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
      className="max-w-[1200px] md:min-w-[588px] max-h-[600px] overflow-y-auto"
    >
      <Modal.CloseAction onClick={() => setShowModalLogout(false)} />
      <Modal.Header title="Sign out?" />
      <Typography.Body className="text-left text-opacity-60" variant="medium">
        If you sign out without backup you will no longer be able to login.
      </Typography.Body>
      <div className="flex gap-4 mt-8">
        <Link className="w-full" href="/logout">
          <Button.Large
            id="logout-modal-sign-out-btn"
            variant="secondary"
            icon={<Icon.SignOut size="16" />}
          >
            Yes, sign out
          </Button.Large>
        </Link>
        <Link className="w-full" href="/settings">
          <Modal.SubmitAction
            id="logout-modal-backup-btn"
            icon={<Icon.Lock size="16" />}
          >
            Backup
          </Modal.SubmitAction>
        </Link>
      </div>
    </Modal.Root>
  );
}
