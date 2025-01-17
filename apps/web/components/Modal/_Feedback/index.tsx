'use client';

import { Modal } from '@social/ui-shared';
import { useEffect, useRef } from 'react';
import { PubkyAppUser } from '@/types/Post';
import ContentFeedback from './_Content';

interface FeedbackProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  error: boolean;
  setError: React.Dispatch<React.SetStateAction<boolean>>;
  sent: boolean;
  setSent: React.Dispatch<React.SetStateAction<boolean>>;
  profile: PubkyAppUser | undefined;
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: () => void;
  loading: boolean;
}

export default function Feedback({
  showModal,
  setShowModal,
  error,
  setError,
  sent,
  setSent,
  profile,
  message,
  setMessage,
  handleSubmit,
  loading,
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
      className="md:w-[792px] max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-webkit"
    >
      <Modal.CloseAction onClick={() => setShowModal(false)} />
      <ContentFeedback
        setShowModal={setShowModal}
        error={error}
        setError={setError}
        sent={sent}
        setSent={setSent}
        profile={profile}
        message={message}
        setMessage={setMessage}
        handleSubmit={handleSubmit}
        loading={loading}
      />
    </Modal.Root>
  );
}
