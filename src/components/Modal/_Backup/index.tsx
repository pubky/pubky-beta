'use client';

import { Modal } from '@social/ui-shared';
import { useState } from 'react';
import ContentBackup from './_Content';

interface BackupProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowBackupSuccess?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Backup({ showModal, setShowModal, setShowBackupSuccess }: BackupProps) {
  const [confirmPhrase, setConfirmPhrase] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showWords, setShowWords] = useState(false);

  return (
    <Modal.Root
      show={showModal}
      closeModal={() => {
        setShowModal(false);
        setShowWords(false);
      }}
      className="md:max-w-[792px] max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-webkit"
    >
      <Modal.CloseAction
        id="backup-close-btn"
        onClick={() => {
          setShowModal(false);
          setShowWords(false);
        }}
      />
      <Modal.Header
        title={success ? 'Backup successful' : confirmPhrase ? 'Confirm Recovery Phrase' : 'Back up your account'}
      />
      <ContentBackup
        setShow={setShowModal}
        setShowBackupSuccess={setShowBackupSuccess}
        confirmPhrase={confirmPhrase}
        setConfirmPhrase={setConfirmPhrase}
        showWords={showWords}
        setShowWords={setShowWords}
        success={success}
        setSuccess={setSuccess}
      />
    </Modal.Root>
  );
}
