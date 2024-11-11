import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Modal from '@/components/Modal';
import { Button, Icon, Tooltip, Typography } from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import { useAlertContext, usePubkyClientContext } from '@/contexts';

const passwordSchema = z.object({
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' }),
});

export default function Account() {
  const router = useRouter();
  const {
    seed,
    setSeed,
    mnemonic,
    setMnemonic,
    getRecoveryFile,
    deleteAccount,
    downloadData,
    logout,
  } = usePubkyClientContext();
  const { setContent, setShow } = useAlertContext();
  const [deleteProgress, setDeleteProgress] = useState(0);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [loadingDownload, setLoadingDownload] = useState(false);
  const [progressDownload, setProgressDownload] = useState(0);
  const [disposableAccount, setDisposableAccount] = useState(false);
  const [showModalBackup, setShowModalBackup] = useState(false);
  const [showModalDeleteAccount, setShowModalDeleteAccount] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [loadingRecoveryFile, setLoadingRecoveryFile] = useState(false);
  const [password, setPassword] = useState('');
  const [errorPassword, setErrorPassword] = useState<string>('');
  const modalBackupRef = useRef<HTMLDivElement>(null);

  const handleDeleteAccount = async () => {
    setDeletingAccount(true);
    setDeleteProgress(0); // Reset progress

    const result = await deleteAccount(setDeleteProgress);

    if (result) {
      setContent('Account deleted successfully!');
      setShow(true);
    } else {
      setContent('Error deleting account', 'warning');
      setShow(true);
    }

    setDeletingAccount(false);
    setShowModalDeleteAccount(false);
    logout();
  };

  const handleDownloadData = async () => {
    setLoadingDownload(true);
    setProgressDownload(0); // Reset progress

    try {
      const result = await downloadData(setProgressDownload);
      if (result) {
        setContent('Data downloaded!');
        setShow(true);
      }
    } catch (error) {
      console.error(error);
      setContent('Something went wrong', 'warning');
      setShow(true);
    } finally {
      setLoadingDownload(false);
    }
  };

  useEffect(() => {
    if (seed) {
      setDisposableAccount(true);
    } else {
      setDisposableAccount(false);
    }
  }, [seed]);

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
      setMnemonic(undefined);
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
      const recoveryFileResponse = await getRecoveryFile(password);

      if (!recoveryFileResponse) {
        throw new Error('Something went wrong');
      }

      await handleDownloadRecoveryFile({
        recoveryFile: recoveryFileResponse,
        filename: 'recovery_key.pkarr',
      });

      Utils.storage.remove('seed');
      Utils.storage.remove('mnemonic');
      setShowModalBackup(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingRecoveryFile(false);
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

  return (
    <div className="px-12 pt-12 pb-0 bg-white bg-opacity-10 rounded-2xl flex-col justify-start items-start gap-12 inline-flex">
      <div className="flex-col justify-start items-start gap-6 flex">
        <div className="justify-start items-center gap-2 inline-flex">
          <Icon.Lock size="24" />
          <Typography.H2>Back up your account</Typography.H2>
        </div>
        <Typography.Body variant="medium" className="text-opacity-80">
          Without a backup you lose your account if you close your browser!
        </Typography.Body>
        <Tooltip.RootSmall setShowTooltip={setShowTooltip}>
          <Button.Large
            icon={
              <Icon.Lock
                size="16"
                color={disposableAccount ? ' white' : 'gray'}
              />
            }
            variant="secondary"
            className="w-auto"
            disabled={!disposableAccount}
            onClick={
              disposableAccount ? () => setShowModalBackup(true) : undefined
            }
          >
            Back up account
          </Button.Large>
          {showTooltip && !seed && !mnemonic && (
            <Tooltip.Small className="w-[278px]">
              <Typography.Body variant="small" className="text-opacity-80">
                You have already done the backup,{' '}
                <span className="text-white font-bold text-opacity-100">
                  your recovery file/phrase has been deleted
                </span>
                .
              </Typography.Body>
            </Tooltip.Small>
          )}
        </Tooltip.RootSmall>
      </div>
      <div className="w-full h-px bg-white bg-opacity-10" />
      <div className="flex-col justify-start items-start gap-6 flex">
        <div className="justify-start items-center gap-2 inline-flex">
          <Icon.Trash size="24" />
          <Typography.H2>Delete your account</Typography.H2>
        </div>
        <Typography.Body variant="medium" className="text-opacity-80">
          Deleting your account will remove all of your posts, tags, profile
          information, contacts, custom streams, and settings or preferences.
        </Typography.Body>
        <Button.Large
          icon={<Icon.Trash size="16" />}
          variant="secondary"
          className="w-auto"
          onClick={() => setShowModalDeleteAccount(true)}
        >
          {deletingAccount ? `Deleting... ${deleteProgress}%` : 'Delete Account'}
        </Button.Large>
      </div>
      <div className="w-full h-px bg-white bg-opacity-10" />
      <div className="flex-col justify-start items-start gap-6 flex">
        <div className="justify-start items-center gap-2 inline-flex">
          <Icon.Pencil size="24" />
          <Typography.H2>Edit your profile</Typography.H2>
        </div>
        <Typography.Body variant="medium" className="text-opacity-80">
          Update your bio or user picture, so friends can find you easier.
        </Typography.Body>
        <Button.Large
          icon={<Icon.Pencil size="16" />}
          variant="secondary"
          className="w-auto"
          onClick={() => router.push('/settings/edit')}
        >
          Edit profile
        </Button.Large>
      </div>
      <div className="w-full h-px bg-white bg-opacity-10" />
      <div className="flex-col justify-start items-start gap-6 flex">
        <div className="justify-start items-center gap-2 inline-flex">
          <Icon.DownloadSimple size="24" />
          <Typography.H2>Download your data</Typography.H2>
        </div>
        <Typography.Body variant="medium" className="text-opacity-80">
          Your data on Pubky is yours. Export your account data to use it
          elsewhere.
        </Typography.Body>
        <Button.Large
          icon={<Icon.DownloadSimple size="16" />}
          variant="secondary"
          className="w-auto"
          loading={loadingDownload}
          onClick={() => (loadingDownload ? undefined : handleDownloadData())}
        >
          {loadingDownload ? `Downloading... ${progressDownload}%` : 'Download data'}
        </Button.Large>
      </div>
      <Modal.Backup
        loading={loadingRecoveryFile}
        setPassword={setPassword}
        handleSubmit={handleRecoveryFile}
        showModalBackup={showModalBackup}
        setShowModalBackup={setShowModalBackup}
        modalBackupRef={modalBackupRef}
        errors={errorPassword}
      />
      <Modal.DeleteAccount
        deletingAccount={deletingAccount}
        deleteProgress={deleteProgress}
        showModalDeleteAccount={showModalDeleteAccount}
        setShowModalDeleteAccount={setShowModalDeleteAccount}
        handleDeleteAccount={handleDeleteAccount}
      />
    </div>
  );
}
