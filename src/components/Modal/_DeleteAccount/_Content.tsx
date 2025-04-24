'use client';

import { useAlertContext, usePubkyClientContext } from '@/contexts';
import { Button, Icon, Modal, Typography } from '@social/ui-shared';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface DeleteAccountProps {
  setShowModalDeleteAccount: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ContentDeleteAccount({ setShowModalDeleteAccount }: DeleteAccountProps) {
  const { deleteAccount } = usePubkyClientContext();
  const router = useRouter();
  const { addAlert } = useAlertContext();
  const [deleteProgress, setDeleteProgress] = useState(0);
  const [deletingAccount, setDeletingAccount] = useState(false);

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
    router.push('/logout');
  };

  return (
    <>
      <Typography.Body className="text-opacity-60 my-4" variant="medium">
        Are you sure? Your account information cannot be recovered.
      </Typography.Body>
      <div className="flex gap-4 mt-2">
        <Button.Large id="cancel-btn" variant="secondary" onClick={() => setShowModalDeleteAccount(false)}>
          Cancel
        </Button.Large>
        <Modal.SubmitAction
          id="delete-account-btn"
          icon={<Icon.Trash size="16" color="#FF0000" />}
          className="bg-[#FF0000] border-[#FF0000]"
          colorText="text-[#FF0000] whitespace-nowrap"
          loading={deletingAccount}
          onClick={() => (deletingAccount ? undefined : handleDeleteAccount())}
        >
          {deletingAccount ? `Deleting... ${deleteProgress}%` : 'Delete Account'}
        </Modal.SubmitAction>
      </div>
    </>
  );
}
