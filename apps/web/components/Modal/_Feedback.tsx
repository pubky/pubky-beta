'use client';

import { Icon, Modal, Typography } from '@social/ui-shared';
import { useEffect, useRef } from 'react';

interface FeedbackProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  error?: boolean;
}

export default function Feedback({
  showModal,
  setShowModal,
  error,
}: FeedbackProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutsideModal = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setShowModal(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutsideModal);

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideModal);
    };
  }, [modalRef, setShowModal]);
  return (
    <Modal.Root
      show={showModal}
      closeModal={() => setShowModal(false)}
      modalRef={modalRef}
      className="w-[588px]"
    >
      <Modal.CloseAction onClick={() => setShowModal(false)} />
      <Modal.Header title={error ? 'Sent Failed' : 'Feedback Received'} />
      <Typography.Body className="text-opacity-60" variant="medium">
        {error
          ? 'Feedback not sent correctly, please try again.'
          : 'Thank you for helping us improve Pubky.'}
      </Typography.Body>
      <div className="flex gap-4 mt-8">
        <Modal.SubmitAction
          icon={error ? <Icon.Warning size="16" /> : <Icon.Check size="16" />}
          onClick={() => setShowModal(false)}
        >
          {error ? 'Try again' : "You're welcome!"}
        </Modal.SubmitAction>
      </div>
    </Modal.Root>
  );
}
