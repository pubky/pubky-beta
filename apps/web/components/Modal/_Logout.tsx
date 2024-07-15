'use client';

import { Button, Icon, Modal, Typography } from '@social/ui-shared';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

interface LogoutProps {
  showModalLogout: boolean;
  setShowModalLogout: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Logout({
  showModalLogout,
  setShowModalLogout,
}: LogoutProps) {
  const router = useRouter();
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
      className="w-[480px]"
    >
      <Modal.CloseAction onClick={() => setShowModalLogout(false)} />
      <Modal.Header title="Sign out?" />
      <Typography.Body className="text-left text-opacity-60" variant="medium">
        If you sign out without backup you will no longer be able to login.
      </Typography.Body>
      <div className="flex gap-4 mt-8">
        <Button.Large
          variant="secondary"
          icon={<Icon.SignOut size="16" />}
          onClick={() => router.push(`/logout`)}
        >
          Yes, sign out
        </Button.Large>
        <Modal.SubmitAction
          icon={<Icon.Lock size="16" />}
          onClick={() => router.push(`/settings`)}
        >
          Backup
        </Modal.SubmitAction>
      </div>
    </Modal.Root>
  );
}
