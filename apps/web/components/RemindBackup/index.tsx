/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { z } from 'zod';
import { Button, Icon, Typography } from '@social/ui-shared';
import { useEffect, useRef, useState } from 'react';
import Modal from '../Modal';
import { Utils } from '@social/utils-shared';
import { usePubkyClientContext } from '@/contexts';

const passwordSchema = z.object({
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' }),
});

export default function RemindBackup() {
  const { seed, setSeed } = usePubkyClientContext();
  //const { getRecoveryFile } = useClientContext();
  const [disposableAccount, setDisposableAccount] = useState(false);
  const [showBackupSuccess, setShowBackupSuccess] = useState(false);
  const [remindMeLater, setRemindMeLater] = useState(false);
  const [loadingRecoveryFile, setLoadingRecoveryFile] = useState(false);
  const [password, setPassword] = useState('');
  const [showModalBackup, setShowModalBackup] = useState(false);
  const modalBackupRef = useRef<HTMLDivElement>(null);
  const [errorPassword, setErrorPassword] = useState<string>('');
  const backupCloseMessage = Utils.storage.get('backup');

  const RemindMe = () => {
    setRemindMeLater(true);
    const timestamp = Date.now() + 300000; // 5min
    Utils.storage.set('timerRemind', timestamp);
  };

  useEffect(() => {
    const timestampNow = Date.now();
    const timestampSaved = Utils.storage.get('timerRemind') as number;
    if (timestampNow >= timestampSaved) {
      setRemindMeLater(false);
    } else {
      setRemindMeLater(true);
    }
  }, []);

  useEffect(() => {
    if (seed) {
      setDisposableAccount(true);
      setShowBackupSuccess(false);
    } else {
      setDisposableAccount(false);
      if (backupCloseMessage === false) {
        setShowBackupSuccess(true);
      }
    }
  }, [seed, backupCloseMessage]);

  useEffect(() => {
    if (backupCloseMessage) {
      setShowBackupSuccess(false);
    } else if (backupCloseMessage === false) {
      setShowBackupSuccess(true);
    }
  }, [backupCloseMessage]);

  const handleDownloadRecoveryFile = async ({
    recoveryFile,
    filename,
  }: {
    recoveryFile: Buffer;
    filename: string;
  }) => {
    try {
      const element = document.createElement('a');

      const fileBlob = new Blob([recoveryFile]);

      element.href = URL.createObjectURL(fileBlob);
      element.download = filename;
      document.body.appendChild(element); // Required for this to work in FireFox
      element.click();
      setSeed(undefined);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRecoveryFile = async () => {
    if (loadingRecoveryFile) {
      return;
    }
    try {
      setLoadingRecoveryFile(true);
      setErrorPassword('');

      const result = passwordSchema.safeParse({
        password,
      });

      if (!result.success) {
        setErrorPassword(
          result.error.errors.map((err) => err.message).join(', ')
        );
        setLoadingRecoveryFile(false);
        return;
      }
      // const recoveryFileResponse = await getRecoveryFile(password);

      // if (!recoveryFileResponse) {
      //   throw new Error('Something went wrong');
      // }

      // const { recoveryFile, filename } = recoveryFileResponse;
      // await handleDownloadRecoveryFile({ recoveryFile, filename });
      // Utils.storage.remove('seed');
      setShowModalBackup(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingRecoveryFile(false);
      setShowBackupSuccess(true);
    }
  };

  useEffect(() => {
    const handleClickOutsideModal = (event: MouseEvent) => {
      if (
        modalBackupRef.current &&
        !modalBackupRef.current.contains(event.target as Node)
      ) {
        setShowModalBackup(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutsideModal);

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideModal);
    };
  }, [modalBackupRef, setShowModalBackup]);

  const Closed = () => {
    setShowBackupSuccess(false);
    Utils.storage.set('backup', true);
  };

  return (
    <div
      className={`max-w-[380px] sm:max-w-[600px] md:max-w-[720px] lg:max-w-[900px] xl:max-w-[1200px] w-full m-auto`}
    >
      {disposableAccount ? (
        <div
          className={`${
            remindMeLater && 'hidden'
          } relative w-full p-12 bg-white rounded-lg shadow border border-white flex-col justify-start items-start gap-6 inline-flex mb-6`}
        >
          <div
            onClick={RemindMe}
            className="cursor-pointer hover:bg-opacity-20 w-12 h-12 absolute right-[25px] top-[25px] p-3 bg-black bg-opacity-10 rounded-[48px] backdrop-blur-[20px] justify-center items-center inline-flex"
          >
            <Icon.X size="24" color="#05050a" />
          </div>
          <Typography.H1 className="text-[#05050a] text-4xl">
            Back up your account
          </Typography.H1>
          <div className="w-full flex justify-between gap-4">
            <Typography.Body className="w-full text-[#05050a]" variant="medium">
              Time to back up your account.
              <br /> Without a backup you lose your account if you close your
              browser!
            </Typography.Body>
            <div className="w-full flex gap-6 justify-end">
              <Button.Large
                onClick={RemindMe}
                variant="secondary"
                className="w-auto shadow-none bg-black bg-opacity-10 hover:bg-opacity-20 border border-transparent"
                colorText="text-[#05050a]"
                icon={<Icon.Clock size="16" color="#05050a" />}
              >
                Remind me later
              </Button.Large>
              <Button.Large
                id="remind-backup-now-btn"
                className="w-auto shadow-none bg-black bg-opacity-10 hover:bg-opacity-20 border border-[#05050a]"
                colorText="text-[#05050a]"
                onClick={() => setShowModalBackup(true)}
                icon={<Icon.Lock size="16" color="#05050a" />}
              >
                Backup now
              </Button.Large>
            </div>
          </div>
        </div>
      ) : (
        showBackupSuccess && (
          <div
            className={`mb-6 w-full p-4 bg-white rounded-lg shadow border border-white flex-col justify-start items-start gap-6 inline-flex`}
          >
            <div className="w-full flex justify-between">
              <div className="flex gap-2">
                <div className="relative">
                  <Icon.CheckCircle size="20" color="#05050a" />
                </div>
                <Typography.Body
                  className="text-[#05050a] text-opacity-80"
                  variant="small-bold"
                >
                  Backup successful! Your seed has been deleted and now you can
                  make login via the chosen recovery method.
                </Typography.Body>
              </div>
              <div className="cursor-pointer" onClick={Closed}>
                <Icon.X size="20" color="#05050a" />
              </div>
            </div>
          </div>
        )
      )}
      <Modal.Backup
        loading={loadingRecoveryFile}
        setPassword={setPassword}
        handleSubmit={handleRecoveryFile}
        showModalBackup={showModalBackup}
        setShowModalBackup={setShowModalBackup}
        modalBackupRef={modalBackupRef}
        errors={errorPassword}
      />
    </div>
  );
}
