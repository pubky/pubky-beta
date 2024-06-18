'use client';

import { Icon, Modal, Typography } from '@social/ui-shared';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

interface SessionExpiredProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SessionExpired({
  showModal,
  setShowModal,
}: SessionExpiredProps) {
  const router = useRouter();
  const modalSessionExpiredRef = useRef<HTMLDivElement>(null);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (showModal) {
      const timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);

      const timeout = setTimeout(() => {
        router.push('/logout');
        setShowModal(false);
      }, 10000);

      return () => {
        clearInterval(timer);
        clearTimeout(timeout);
      };
    }
  }, [showModal, router, setShowModal]);

  return (
    <Modal.Root
      show={showModal}
      modalRef={modalSessionExpiredRef}
      className="w-[480px]"
    >
      <Modal.Header title="Session expired" />
      <Typography.Body className="text-opacity-60" variant="medium">
        Your session has expired, please log in again
      </Typography.Body>
      <Modal.SubmitAction
        icon={<Icon.SignOut size="16" />}
        onClick={() => {
          router.push('/logout');
          setShowModal(false);
        }}
        className="mt-8"
      >
        Logout ({countdown})
      </Modal.SubmitAction>
    </Modal.Root>
  );
}
