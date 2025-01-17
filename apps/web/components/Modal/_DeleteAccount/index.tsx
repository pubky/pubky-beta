'use client';

import { Modal } from '@social/ui-shared';
import { useEffect, useRef } from 'react';
import ContentDeleteAccount from './_Content';

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
      handleClickOutsideModalDeleteAccount,
    );

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutsideModalDeleteAccount,
      );
    };
  }, [modalDeleteAccountRef, setShowModalDeleteAccount]);
  return (
    <Modal.Root
      show={showModalDeleteAccount}
      closeModal={() => setShowModalDeleteAccount(false)}
      modalRef={modalDeleteAccountRef}
      className="max-w-[1200px] md:min-w-[588px] max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-webkit"
    >
      <Modal.CloseAction onClick={() => setShowModalDeleteAccount(false)} />
      <Modal.Header title="Delete Account" />
      <ContentDeleteAccount
        setShowModalDeleteAccount={setShowModalDeleteAccount}
        handleDeleteAccount={handleDeleteAccount}
        deletingAccount={deletingAccount}
        deleteProgress={deleteProgress}
      />
    </Modal.Root>
  );
}
