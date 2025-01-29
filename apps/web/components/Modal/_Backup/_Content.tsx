'use client';

import { Button, Card, Icon, Typography } from '@social/ui-shared';
import { useState } from 'react';
import File from './_File';
import Phrase from './_Phrase';
import Success from './_Success';

interface BackupProps {
  loading: boolean;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: () => Promise<void>;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  errors: string;
  setShowBackupSuccess?: React.Dispatch<React.SetStateAction<boolean>>;
  confirmPhrase: boolean;
  setConfirmPhrase: React.Dispatch<React.SetStateAction<boolean>>;
  showWords: boolean;
  setShowWords: React.Dispatch<React.SetStateAction<boolean>>;
  success: boolean;
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ContentBackup({
  loading,
  setPassword,
  handleSubmit,
  setShow,
  setShowBackupSuccess,
  errors,
  confirmPhrase,
  setConfirmPhrase,
  showWords,
  setShowWords,
  success,
  setSuccess,
}: BackupProps) {
  const [phrase, setPhrase] = useState(false);
  const [file, setFile] = useState(false);

  return (
    <>
      {success ? (
        <Success setShow={setShow} />
      ) : phrase ? (
        <Phrase
          setShowBackupSuccess={setShowBackupSuccess}
          setPhrase={setPhrase}
          confirmPhrase={confirmPhrase}
          setConfirmPhrase={setConfirmPhrase}
          showWords={showWords}
          setShowWords={setShowWords}
          setSuccess={setSuccess}
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
    </>
  );
}
