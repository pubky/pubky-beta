'use client';

import { Button, Icon, Modal, Typography } from '@social/ui-shared';
import { useEffect, useRef } from 'react';

interface DeleteAccountProps {
  showModalDeleteAccount: boolean;
  setShowModalDeleteAccount: React.Dispatch<React.SetStateAction<boolean>>;
  handleDeleteAccount: () => void;
  deletingAccount: boolean;
  deleteProgress: number;
}

export default function DeleteAccount({
  showModalDeleteAccount,
  setShowModalDeleteAccount,
  handleDeleteAccount,
  deletingAccount,
  deleteProgress,
}: DeleteAccountProps) {
  const modalDeleteAccountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutsideModalDeleteAccount = (event: MouseEvent) => {
      if (
        modalDeleteAccountRef.current &&
        !modalDeleteAccountRef.current.contains(event.target as Node)
      ) {
        setShowModalDeleteAccount(false);
      }
    };
    document.addEventListener(
      'mousedown',
      handleClickOutsideModalDeleteAccount
    );

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutsideModalDeleteAccount
      );
    };
  }, [modalDeleteAccountRef, setShowModalDeleteAccount]);
  return (
    <Modal.Root
      show={showModalDeleteAccount}
      closeModal={() => setShowModalDeleteAccount(false)}
      modalRef={modalDeleteAccountRef}
      className="w-[588px]"
    >
      <Modal.CloseAction onClick={() => setShowModalDeleteAccount(false)} />
      <Modal.Header title="Delete Account" />
      <Typography.Body className="text-opacity-60" variant="medium">
        Are you sure you want to delete your account?
      </Typography.Body>
      <div className="flex gap-4 mt-8">
        <Button.Large
          id="cancel-btn"
          variant="secondary"
          onClick={() => setShowModalDeleteAccount(false)}
        >
          Cancel
        </Button.Large>
        <Modal.SubmitAction
          id="delete-post-btn"
          icon={<Icon.Trash size="16" color="#dc2626" />}
          className="bg-[#dc2626] border-[#dc2626]"
          colorText="text-[#dc2626]"
          loading={deletingAccount}
          onClick={() => (deletingAccount ? undefined : handleDeleteAccount())}
        >
          {deletingAccount
            ? `Deleting... ${deleteProgress}%`
            : 'Delete Account'}
        </Modal.SubmitAction>
      </div>
    </Modal.Root>
  );
}
