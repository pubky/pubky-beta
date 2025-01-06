'use client';

import { BottomSheet } from '@social/ui-shared';
import { useState } from 'react';
import ContentBackup from '../Modal/_Backup/_Content';

interface BackupProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  errors: string;
  setShowBackupSuccess?: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: () => Promise<void>;
  title?: string;
  className?: string;
}

export default function Backup({
  show,
  setShow,
  errors,
  setShowBackupSuccess,
  loading,
  setPassword,
  handleSubmit,
  title,
  className,
}: BackupProps) {
  const [confirmPhrase, setConfirmPhrase] = useState(false);
  const [showWords, setShowWords] = useState(false);

  return (
    <BottomSheet.Root
      show={show}
      setShow={setShow}
      title={
        (title ?? confirmPhrase)
          ? 'Confirm Recovery Phrase'
          : 'Back up your account'
      }
      className={className}
    >
      <ContentBackup
        loading={loading}
        setPassword={setPassword}
        handleSubmit={handleSubmit}
        setShow={setShow}
        setShowBackupSuccess={setShowBackupSuccess}
        errors={errors}
        confirmPhrase={confirmPhrase}
        setConfirmPhrase={setConfirmPhrase}
        showWords={showWords}
        setShowWords={setShowWords}
      />
    </BottomSheet.Root>
  );
}
