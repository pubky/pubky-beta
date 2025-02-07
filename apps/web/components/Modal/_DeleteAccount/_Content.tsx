'use client';

import { Button, Icon, Modal, Typography } from '@social/ui-shared';

interface DeleteAccountProps {
  setShowModalDeleteAccount: React.Dispatch<React.SetStateAction<boolean>>;
  handleDeleteAccount: () => void;
  deletingAccount: boolean;
  deleteProgress: number;
}

export default function ContentDeleteAccount({
  setShowModalDeleteAccount,
  handleDeleteAccount,
  deletingAccount,
  deleteProgress,
}: DeleteAccountProps) {
  return (
    <>
      <Typography.Body className="text-opacity-60 my-4" variant="medium">
        Are you sure? Your account information cannot be recovered.
      </Typography.Body>
      <div className="flex gap-4 mt-2">
        <Button.Large
          id="cancel-btn"
          variant="secondary"
          onClick={() => setShowModalDeleteAccount(false)}
        >
          Cancel
        </Button.Large>
        <Modal.SubmitAction
          id="delete-account-btn"
          icon={<Icon.Trash size="16" color="#dc2626" />}
          className="bg-[#dc2626] border-[#dc2626]"
          colorText="text-[#dc2626] whitespace-nowrap"
          loading={deletingAccount}
          onClick={() => (deletingAccount ? undefined : handleDeleteAccount())}
        >
          {deletingAccount
            ? `Deleting... ${deleteProgress}%`
            : 'Delete Account'}
        </Modal.SubmitAction>
      </div>
    </>
  );
}
