'use client';

import { BottomSheet, Button, Card, Icon, Typography } from '@social/ui-shared';
import Phrase from '../Modal/_Backup/_Phrase';
import File from '../Modal/_Backup/_File';
import { useState } from 'react';

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
  const [phrase, setPhrase] = useState(false);
  const [file, setFile] = useState(false);
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
      {phrase ? (
        <Phrase
          setShowModalBackup={setShow}
          setShowBackupSuccess={setShowBackupSuccess}
          setPhrase={setPhrase}
          confirmPhrase={confirmPhrase}
          setConfirmPhrase={setConfirmPhrase}
          showWords={showWords}
          setShowWords={setShowWords}
        />
      ) : file ? (
        <File
          loading={loading}
          setPassword={setPassword}
          handleSubmit={handleSubmit}
          errors={errors}
          setFile={setFile}
        />
      ) : (
        <>
          <Typography.Body
            className="text-opacity-80 my-4"
            variant="medium-light"
          >
            Please choose how you want to back up your account. For security
            reasons, your recovery phrase or recovery file{' '}
            <strong className="font-bold text-white text-opacity-100">
              will be deleted once you complete the backup.
            </strong>
          </Typography.Body>
          <div className="flex flex-col sm:flex-row gap-6">
            <Card.Primary
              title="Recovery Phrase"
              text="Write down 12 words to recover your account at a later date."
            >
              <div className="flex justify-center items-center my-10">
                <Icon.FileText size="128" />
              </div>
              <Button.Large
                id="backup-recovery-phrase-btn"
                icon={<Icon.FileText />}
                onClick={() => setPhrase(true)}
              >
                Recovery Phrase
              </Button.Large>
            </Card.Primary>
            <Card.Primary
              title="Recovery File"
              text="Download a password encrypted, digital file to your computer."
            >
              <div className="flex justify-center items-center my-10">
                <Icon.DownloadSimple size="128" />
              </div>
              <Button.Large
                id="backup-recovery-file-btn"
                icon={<Icon.DownloadSimple />}
                onClick={() => setFile(true)}
              >
                Recovery File
              </Button.Large>
            </Card.Primary>
          </div>
        </>
      )}
    </BottomSheet.Root>
  );
}
