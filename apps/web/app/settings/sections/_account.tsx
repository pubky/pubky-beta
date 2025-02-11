'use client';

import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Modal from '@/components/Modal';
import { Button, Icon, Input, Tooltip, Typography } from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import { useAlertContext, usePubkyClientContext } from '@/contexts';
import Link from 'next/link';
import { useIsMobile } from '@/hooks/useIsMobile';
import { BottomSheet } from '@/components';

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
    importData,
  } = usePubkyClientContext();
  const { addAlert } = useAlertContext();
  const isMobile = useIsMobile();
  const [fileName, setFileName] = useState('file.zip');
  const [deleteProgress, setDeleteProgress] = useState(0);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [loadingDownload, setLoadingDownload] = useState(false);
  const [progressDownload, setProgressDownload] = useState(0);
  const [importProgress, setImportProgress] = useState(0);
  const [importingData, setImportingData] = useState(false);
  const [success, setSuccess] = useState(false);
  const [disposableAccount, setDisposableAccount] = useState(false);
  const [showModalBackup, setShowModalBackup] = useState(false);
  const [showSheetBackup, setShowSheetBackup] = useState(false);
  const [showModalDeleteAccount, setShowModalDeleteAccount] = useState(false);
  const [showSheetDeleteAccount, setShowSheetDeleteAccount] = useState(false);
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
      addAlert('Account deleted successfully!');
    } else {
      addAlert('Error deleting account', 'warning');
    }

    setDeletingAccount(false);
    setShowModalDeleteAccount(false);
    setShowSheetDeleteAccount(false);
    router.push('/logout');
  };

  const handleDownloadData = async () => {
    setLoadingDownload(true);
    setProgressDownload(0); // Reset progress

    try {
      const result = await downloadData(setProgressDownload);
      if (result) {
        addAlert('Data downloaded!');
      }
    } catch (error) {
      console.error(error);
      addAlert('Something went wrong', 'warning');
    } finally {
      setLoadingDownload(false);
    }
  };

  const handleImportData = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      setFileName(event.target.files[0].name);
    }
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    setImportingData(true);
    setImportProgress(0);

    const result = await importData(file, setImportProgress);

    if (result) {
      addAlert('Data imported successfully!');
    } else {
      addAlert('Error importing data', 'warning');
    }

    router.push('/profile');
    setImportingData(false);
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
          result.error.errors.map((err) => err.message).join(', '),
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
      setSuccess(true);
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
    <div className="p-8 md:p-12 bg-white bg-opacity-10 rounded-lg flex-col justify-start items-start inline-flex">
      <div className="flex-col justify-start items-start gap-6 flex">
        <div className="justify-start items-center gap-2 inline-flex">
          <Icon.SignOut size="24" />
          <Typography.H2>Sign out from Pubky</Typography.H2>
        </div>
        <Typography.Body variant="medium" className="text-opacity-80">
          Sign out to protect your account from unauthorized access.
        </Typography.Body>
        <Link href="/logout">
          <Button.Large
            id="settings-sign-out-btn"
            icon={<Icon.SignOut size="18" />}
            variant="secondary"
            className="w-auto"
          >
            Sign out
          </Button.Large>
        </Link>
      </div>
      <div className="w-full h-px bg-white bg-opacity-10 my-12" />
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
            id="backup-account-btn"
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
              disposableAccount
                ? () =>
                    isMobile
                      ? setShowSheetBackup(true)
                      : setShowModalBackup(true)
                : undefined
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
      <div className="w-full h-px bg-white bg-opacity-10 my-12" />
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
          id="delete-account-btn"
          icon={<Icon.Trash size="16" />}
          variant="secondary"
          className="w-auto"
          onClick={() =>
            isMobile
              ? setShowSheetDeleteAccount(true)
              : setShowModalDeleteAccount(true)
          }
          loading={deletingAccount}
        >
          {deletingAccount
            ? `Deleting... ${deleteProgress}%`
            : 'Delete Account'}
        </Button.Large>
      </div>
      <div className="w-full h-px bg-white bg-opacity-10 my-12" />
      <div className="flex-col justify-start items-start gap-6 flex">
        <div className="justify-start items-center gap-2 inline-flex">
          <Icon.Pencil size="24" />
          <Typography.H2>Edit your profile</Typography.H2>
        </div>
        <Typography.Body variant="medium" className="text-opacity-80">
          Update your bio or user picture, so friends can find you easier.
        </Typography.Body>
        <Link href="/settings/edit">
          <Button.Large
            id="edit-profile-btn"
            icon={<Icon.Pencil size="16" />}
            variant="secondary"
            className="w-auto"
          >
            Edit profile
          </Button.Large>
        </Link>
      </div>
      <div className="w-full h-px bg-white bg-opacity-10 my-12" />
      <div className="flex-col justify-start items-start gap-6 flex">
        <div className="justify-start items-center gap-2 inline-flex">
          <Icon.DownloadSimple size="24" />
          <Typography.H2>Download your data</Typography.H2>
        </div>
        <Typography.Body variant="medium" className="text-opacity-80">
          Your data on Pubky is yours. Export your account data to use it
          elsewhere. Note this is not a full pubky homeserver export, this
          function will export data related to pubky.app.
        </Typography.Body>
        <Button.Large
          id="download-data-btn"
          icon={<Icon.DownloadSimple size="16" />}
          variant="secondary"
          className="w-auto"
          loading={loadingDownload}
          onClick={() => (loadingDownload ? undefined : handleDownloadData())}
        >
          {loadingDownload
            ? `Downloading... ${progressDownload}%`
            : 'Download data'}
        </Button.Large>
      </div>
      <div className="w-full h-px bg-white bg-opacity-10 my-12" />
      <div className="flex-col justify-start items-start gap-6 flex">
        <div className="justify-start items-center gap-2 inline-flex">
          <Icon.UploadSimple size="18" />
          <Typography.H2>Import your data</Typography.H2>
        </div>
        <Typography.Body variant="medium" className="text-opacity-80">
          Import your account data from a backup ZIP file. Note this is not a
          full pubky homeserver import, this function will import pubky.app
          data.
        </Typography.Body>
        <Input.UploadFile
          accept=".zip"
          fileName={
            importingData ? `Importing... ${importProgress}%` : fileName
          }
          className="mb-4 w-full md:w-[350px]"
          id="file_input"
          onChange={handleImportData}
          disabled={importingData}
        />
      </div>
      <Modal.Backup
        loading={loadingRecoveryFile}
        setPassword={setPassword}
        handleSubmit={handleRecoveryFile}
        showModalBackup={showModalBackup}
        setShowModalBackup={setShowModalBackup}
        modalBackupRef={modalBackupRef}
        errors={errorPassword}
        success={success}
        setSuccess={setSuccess}
      />
      <Modal.DeleteAccount
        deletingAccount={deletingAccount}
        deleteProgress={deleteProgress}
        showModalDeleteAccount={showModalDeleteAccount}
        setShowModalDeleteAccount={setShowModalDeleteAccount}
        handleDeleteAccount={handleDeleteAccount}
      />
      <BottomSheet.Backup
        loading={loadingRecoveryFile}
        setPassword={setPassword}
        handleSubmit={handleRecoveryFile}
        show={showSheetBackup}
        setShow={setShowSheetBackup}
        errors={errorPassword}
        success={success}
        setSuccess={setSuccess}
      />
      <BottomSheet.DeleteAccount
        deletingAccount={deletingAccount}
        deleteProgress={deleteProgress}
        show={showSheetDeleteAccount}
        setShow={setShowSheetDeleteAccount}
        handleDeleteAccount={handleDeleteAccount}
      />
    </div>
  );
}
