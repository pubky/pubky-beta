'use client';

import { BottomSheet } from '@social/ui-shared';
import { useState } from 'react';
import ContentBackup from '../Modal/_Backup/_Content';

interface BackupProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  setShowBackupSuccess?: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  className?: string;
}

export default function Backup({ show, setShow, setShowBackupSuccess, title, className }: BackupProps) {
  const [success, setSuccess] = useState(false);
  const [confirmPhrase, setConfirmPhrase] = useState(false);
  const [showWords, setShowWords] = useState(false);

  return (
    <BottomSheet.Root
      show={show}
      setShow={setShow}
      title={
        (title ?? confirmPhrase) ? 'Confirm Recovery Phrase' : success ? 'Backup successful' : 'Back up your account'
      }
      className={className}
    >
      <ContentBackup
        setShow={setShow}
        setShowBackupSuccess={setShowBackupSuccess}
        confirmPhrase={confirmPhrase}
        setConfirmPhrase={setConfirmPhrase}
        showWords={showWords}
        setShowWords={setShowWords}
        success={success}
        setSuccess={setSuccess}
      />
    </BottomSheet.Root>
  );
}
