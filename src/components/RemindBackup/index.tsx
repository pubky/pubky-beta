'use client';

import { Button, Icon, Typography } from '@social/ui-shared';
import { useEffect, useState } from 'react';
import { Utils } from '@social/utils-shared';
import { useModal, usePubkyClientContext } from '@/contexts';

export default function RemindBackup() {
  const { seed, profile, mnemonic } = usePubkyClientContext();
  const { openModal } = useModal();
  const [disposableAccount, setDisposableAccount] = useState(false);
  const [showBackupSuccess, setShowBackupSuccess] = useState(false);
  const [remindMeLater, setRemindMeLater] = useState(false);
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
    if ((seed || mnemonic) && profile?.name !== 'anonymous') {
      setDisposableAccount(true);
      setShowBackupSuccess(false);
    } else {
      setDisposableAccount(false);
      if (backupCloseMessage === false) {
        setShowBackupSuccess(true);
      }
    }
  }, [seed, mnemonic, backupCloseMessage]);

  useEffect(() => {
    if (backupCloseMessage) {
      setShowBackupSuccess(false);
    } else if (backupCloseMessage === false) {
      setShowBackupSuccess(true);
    }
  }, [backupCloseMessage]);

  const Closed = () => {
    setShowBackupSuccess(false);
    Utils.storage.set('backup', true);
  };

  return (
    <div
      className={`max-w-[380px] sm:max-w-[600px] md:max-w-[720px] lg:max-w-[900px] xl:max-w-[1200px] w-full m-auto px-2`}
    >
      {disposableAccount ? (
        <div
          className={`${
            remindMeLater && 'hidden'
          } relative w-full px-6 py-3 sm:px-12 sm:py-9 bg-[#c8ff00]/10 rounded-lg shadow flex-col justify-start items-start gap-2 inline-flex mb-2 lg:mb-4`}
        >
          <Typography.Body variant="large-bold" className="text-[#c8ff00] text-2xl">
            Back up your account
          </Typography.Body>
          <div className="w-full md:flex justify-between gap-4">
            <Typography.Body className="w-full text-[#c8ff00] mb-4 md:mb-0" variant="medium">
              Time to back up your account.
              <br /> Without a backup you lose your account if you close your browser!
            </Typography.Body>
            <div className="w-full flex gap-6 md:justify-end">
              <Button.Large
                onClick={RemindMe}
                variant="secondary"
                className="whitespace-nowrap w-auto shadow-none bg-[#c8ff00] bg-opacity-10 hover:bg-opacity-20 border border-transparent"
                colorText="text-[#c8ff00]"
                icon={<Icon.Clock size="16" color="#c8ff00" />}
              >
                <span className="hidden sm:block">Remind me later</span>
                <span className="block sm:hidden">Later</span>
              </Button.Large>
              <Button.Large
                id="remind-backup-now-btn"
                className="whitespace-nowrap w-auto shadow-none bg-[#c8ff00] bg-opacity-10 hover:bg-opacity-20 border border-[#c8ff00]"
                colorText="text-[#c8ff00]"
                onClick={() => openModal('backup', { setShowBackupSuccess })}
                icon={<Icon.Lock size="16" color="#c8ff00" />}
              >
                Backup now
              </Button.Large>
            </div>
          </div>
        </div>
      ) : (
        showBackupSuccess && (
          <div
            className={`mb-2 lg:mb-6 w-full p-4 bg-[#c8ff00]/10 rounded-lg shadow flex-col justify-start items-start gap-6 inline-flex`}
          >
            <div className="w-full flex justify-between">
              <div className="flex gap-2">
                <div className="relative">
                  <Icon.CheckCircle size="20" color="#c8ff00" />
                </div>
                <Typography.Body className="text-[#c8ff00] text-opacity-80" variant="small">
                  <span className="font-bold">Backup successful!</span> Your recovery file/phrase has been deleted and
                  now you can make login via the chosen recovery method.
                </Typography.Body>
              </div>
              <div className="cursor-pointer" onClick={Closed}>
                <Icon.X size="20" color="#c8ff00" />
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}
