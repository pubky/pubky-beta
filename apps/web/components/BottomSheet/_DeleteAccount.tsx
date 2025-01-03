'use client';

import { BottomSheet, Button, Icon, Typography } from '@social/ui-shared';

interface DeleteAccountProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  handleDeleteAccount: () => void;
  deletingAccount: boolean;
  deleteProgress: number;
  title?: string;
  className?: string;
}

export default function DeleteAccount({
  show,
  setShow,
  handleDeleteAccount,
  deletingAccount,
  deleteProgress,
  title,
  className,
}: DeleteAccountProps) {
  return (
    <BottomSheet.Root
      show={show}
      setShow={setShow}
      title={title ?? 'Delete Account'}
      className={className}
    >
      <Typography.Body className="text-opacity-60 my-4" variant="medium">
        Are you sure? Your account information cannot be recovered.
      </Typography.Body>
      <div className="flex gap-4 mt-2">
        <Button.Large
          id="cancel-btn"
          variant="secondary"
          onClick={() => setShow(false)}
        >
          Cancel
        </Button.Large>
        <Button.Large
          id="delete-account-btn"
          icon={<Icon.Trash size="16" color="#dc2626" />}
          className="bg-[#dc2626] border-[#dc2626]"
          colorText="text-[#dc2626]"
          loading={deletingAccount}
          onClick={() => (deletingAccount ? undefined : handleDeleteAccount())}
        >
          {deletingAccount
            ? `Deleting... ${deleteProgress}%`
            : 'Delete Account'}
        </Button.Large>
      </div>
    </BottomSheet.Root>
  );
}
