'use client';

import { Button, Card, Icon, Typography } from '@social/ui-shared';
import { useState } from 'react';
import File from './_File';
import Phrase from './_Phrase';
import Success from './_Success';
import { z } from 'zod';
import { useAlertContext, usePubkyClientContext } from '@/contexts';
import { Utils } from '@social/utils-shared';

interface BackupProps {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  setShowBackupSuccess?: React.Dispatch<React.SetStateAction<boolean>>;
  confirmPhrase: boolean;
  setConfirmPhrase: React.Dispatch<React.SetStateAction<boolean>>;
  showWords: boolean;
  setShowWords: React.Dispatch<React.SetStateAction<boolean>>;
  success: boolean;
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
}

const passwordSchema = z.object({
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' })
});

export default function ContentBackup({
  setShow,
  setShowBackupSuccess,
  confirmPhrase,
  setConfirmPhrase,
  showWords,
  setShowWords,
  success,
  setSuccess
}: BackupProps) {
  const { getRecoveryFile, setSeed, setMnemonic } = usePubkyClientContext();
  const { addAlert } = useAlertContext();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string>('');
  const [phrase, setPhrase] = useState(false);
  const [file, setFile] = useState(false);

  const handleDownloadRecoveryFile = ({ recoveryFile, filename }) => {
    try {
      const blob = new Blob([recoveryFile], { type: 'application/octet-stream' });

      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(link.href);
      setSeed(undefined);
      setMnemonic(undefined);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async () => {
    if (loading) return;

    try {
      setLoading(true);
      setErrors('');

      const result = passwordSchema.safeParse({ password });

      if (!result.success) {
        setErrors(result.error.errors.map((err) => err.message).join(', '));
        setLoading(false);
        return;
      }
      const recoveryFileResponse = await getRecoveryFile(password);

      if (!recoveryFileResponse) {
        throw new Error('Something went wrong');
      }

      await handleDownloadRecoveryFile({
        recoveryFile: recoveryFileResponse,
        filename: 'recovery_key.pkarr'
      });

      Utils.storage.remove('seed');
      Utils.storage.remove('mnemonic');
      setSuccess(true);
    } catch (error) {
      console.log(error);
      addAlert('Something wrong. Try again', 'warning');
    } finally {
      setLoading(false);
      setShowBackupSuccess && setShowBackupSuccess(true);
    }
  };

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
          password={password}
          setPassword={setPassword}
          handleSubmit={handleSubmit}
          errors={errors}
          setFile={setFile}
        />
      ) : (
        <>
          <Typography.Body className="text-opacity-80 my-4" variant="medium-light">
            Please choose how you want to back up your account. For security reasons, your recovery phrase or recovery
            file{' '}
            <strong className="font-bold text-white text-opacity-100">
              will be deleted once you complete the backup.
            </strong>
          </Typography.Body>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-6">
            <Card.Primary title="Recovery Phrase" text="Write down 12 words to recover your account at a later date.">
              <div className="hidden md:flex justify-center items-center my-10">
                <Icon.FileText size="128" />
              </div>
              <Button.Large
                id="backup-recovery-phrase-btn"
                className="mt-4 md:mt-0"
                icon={<Icon.FileText />}
                onClick={() => setPhrase(true)}
              >
                Recovery Phrase
              </Button.Large>
            </Card.Primary>
            <Card.Primary title="Recovery File" text="Download a password encrypted, digital file to your computer.">
              <div className="hidden md:flex justify-center items-center my-10">
                <Icon.DownloadSimple size="128" />
              </div>
              <Button.Large
                id="backup-recovery-file-btn"
                icon={<Icon.DownloadSimple />}
                className="mt-4 md:mt-0"
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
