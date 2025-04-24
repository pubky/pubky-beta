'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button, Icon, Input, Tooltip, Typography } from '@social/ui-shared';
import { useAlertContext, useModal, usePubkyClientContext } from '@/contexts';
import Link from 'next/link';

export default function Account() {
  const router = useRouter();
  const { seed, mnemonic, downloadData, importData } = usePubkyClientContext();
  const { addAlert } = useAlertContext();
  const { openModal } = useModal();
  const [fileName, setFileName] = useState('file.zip');
  const [loadingDownload, setLoadingDownload] = useState(false);
  const [progressDownload, setProgressDownload] = useState(0);
  const [importProgress, setImportProgress] = useState(0);
  const [importingData, setImportingData] = useState(false);
  const [disposableAccount, setDisposableAccount] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

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

  const handleImportData = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
          <Icon.Pencil size="24" />
          <Typography.H2>Edit your profile</Typography.H2>
        </div>
        <Typography.Body variant="medium" className="text-opacity-80">
          Update your bio or user picture, so friends can find you easier.
        </Typography.Body>
        <Link href="/settings/edit">
          <Button.Large id="edit-profile-btn" icon={<Icon.Pencil size="16" />} variant="secondary" className="w-auto">
            Edit profile
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
          {disposableAccount
            ? 'Without a backup you lose your account if you close your browser!'
            : 'You have already completed the backup, or closed your browser before doing so. Your recovery file and seed phrase have been deleted.'}
        </Typography.Body>
        <Tooltip.RootSmall setShowTooltip={setShowTooltip}>
          <Button.Large
            id="backup-account-btn"
            icon={<Icon.Lock size="16" color={disposableAccount ? ' white' : 'gray'} />}
            variant="secondary"
            className="w-auto"
            disabled={!disposableAccount}
            onClick={disposableAccount ? () => openModal('backup') : undefined}
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
          <Icon.DownloadSimple size="24" />
          <Typography.H2>Download your data</Typography.H2>
        </div>
        <Typography.Body variant="medium" className="text-opacity-80">
          Your data on Pubky is yours. Export your account data to use it elsewhere. Note this is not a full pubky
          homeserver export, this function will export data related to pubky.app.
        </Typography.Body>
        <Button.Large
          id="download-data-btn"
          icon={<Icon.DownloadSimple size="16" />}
          variant="secondary"
          className="w-auto"
          loading={loadingDownload}
          onClick={() => (loadingDownload ? undefined : handleDownloadData())}
        >
          {loadingDownload ? `Downloading... ${progressDownload}%` : 'Download data'}
        </Button.Large>
      </div>
      <div className="w-full h-px bg-white bg-opacity-10 my-12" />
      <div className="flex-col justify-start items-start gap-6 flex">
        <div className="justify-start items-center gap-2 inline-flex">
          <Icon.UploadSimple size="18" />
          <Typography.H2>Import your data</Typography.H2>
        </div>
        <Typography.Body variant="medium" className="text-opacity-80">
          Import your account data from a backup ZIP file. Note this is not a full pubky homeserver import, this
          function will import pubky.app data.
        </Typography.Body>
        <Input.UploadFile
          accept=".zip"
          fileName={importingData ? `Importing... ${importProgress}%` : fileName}
          className="mb-4 w-full md:w-[350px]"
          id="file_input"
          onChange={handleImportData}
          disabled={importingData}
        />
      </div>
      <div className="w-full h-px bg-white bg-opacity-10 my-12" />
      <div className="flex-col justify-start items-start gap-6 flex">
        <div className="justify-start items-center gap-2 inline-flex">
          <Icon.Trash size="24" />
          <Typography.H2>Delete your account</Typography.H2>
        </div>
        <Typography.Body variant="medium" className="text-opacity-80">
          Deleting your account will remove all of your posts, tags, profile information, contacts, custom streams, and
          settings or preferences.
        </Typography.Body>
        <Button.Large
          id="delete-account-btn"
          icon={<Icon.Trash size="16" color="#FF0000" />}
          variant="secondary"
          className="w-auto bg-[#FF0000] border border-[#FF0000]"
          colorText="text-[#FF0000]"
          onClick={() => openModal('deleteAccount')}
        >
          Delete Account
        </Button.Large>
      </div>
    </div>
  );
}
