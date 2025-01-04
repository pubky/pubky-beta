'use client';

import { BottomSheet } from '@social/ui-shared';
import ContentDeleteAccount from '../Modal/_DeleteAccount/_Content';

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
      <ContentDeleteAccount
        setShowModalDeleteAccount={setShow}
        handleDeleteAccount={handleDeleteAccount}
        deletingAccount={deletingAccount}
        deleteProgress={deleteProgress}
      />
    </BottomSheet.Root>
  );
}
