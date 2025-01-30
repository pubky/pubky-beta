'use client';

import { Modal } from '@social/ui-shared';
import { useState } from 'react';
import ContentBackup from './_Content';

interface BackupProps {
  loading: boolean;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: () => Promise<void>;
  showModalBackup: boolean;
  setShowModalBackup: React.Dispatch<React.SetStateAction<boolean>>;
  modalBackupRef: React.RefObject<HTMLDivElement>;
  errors: string;
  setShowBackupSuccess?: React.Dispatch<React.SetStateAction<boolean>>;
  success: boolean;
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Backup({
  loading,
  setPassword,
  handleSubmit,
  showModalBackup,
  setShowModalBackup,
  modalBackupRef,
  setShowBackupSuccess,
  errors,
  success,
  setSuccess,
}: BackupProps) {
  const [confirmPhrase, setConfirmPhrase] = useState(false);
  const [showWords, setShowWords] = useState(false);

  return (
    <Modal.Root
      show={showModalBackup}
      closeModal={() => {
        setShowModalBackup(false);
        setShowWords(false);
      }}
      modalRef={modalBackupRef}
      className="md:max-w-[792px] max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-webkit"
    >
      <Modal.CloseAction
        id="backup-close-btn"
        onClick={() => {
          setShowModalBackup(false);
          setShowWords(false);
        }}
      />
      <Modal.Header
        title={
          confirmPhrase
            ? 'Confirm Recovery Phrase'
            : success
              ? 'Backup successful'
              : 'Back up your account'
        }
      />
      <ContentBackup
        loading={loading}
        setPassword={setPassword}
        handleSubmit={handleSubmit}
        setShow={setShowModalBackup}
        setShowBackupSuccess={setShowBackupSuccess}
        errors={errors}
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
