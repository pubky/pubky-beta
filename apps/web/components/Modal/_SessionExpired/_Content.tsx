'use client';

import { Icon, Modal, Typography } from '@social/ui-shared';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface SessionExpiredProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ContentSessionExpired({
  show,
  setShow,
}: SessionExpiredProps) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (show) {
      const timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);

      const timeout = setTimeout(() => {
        router.push('/logout');
        setShow(false);
      }, 10000);

      return () => {
        clearInterval(timer);
        clearTimeout(timeout);
      };
    }
  }, [show, router, setShow]);

  return (
    <>
      <Typography.Body className="text-opacity-60" variant="medium">
        Your session has expired, please log in again
      </Typography.Body>
      <Modal.SubmitAction
        icon={<Icon.SignOut size="16" />}
        onClick={() => {
          router.push('/logout');
          setShow(false);
        }}
        className="mt-8"
      >
        Logout ({countdown})
      </Modal.SubmitAction>
    </>
  );
}
