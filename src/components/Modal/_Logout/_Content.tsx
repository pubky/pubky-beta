'use client';

import { useModal } from '@/contexts';
import { Button, Icon, Modal, Typography } from '@social/ui-shared';
import Link from 'next/link';

export default function ContentLogout() {
  const { openModal } = useModal();

  return (
    <>
      <Typography.Body className="text-left text-opacity-60 my-4" variant="medium">
        If you sign out without backup you will no longer be able to login.
      </Typography.Body>
      <div className="flex gap-4 mt-2">
        <Link className="w-full" href="/logout">
          <Button.Large
            id="logout-modal-sign-out-btn"
            variant="secondary"
            className="whitespace-nowrap"
            icon={<Icon.SignOut size="16" />}
          >
            Yes, sign out
          </Button.Large>
        </Link>
        <Modal.SubmitAction
          id="logout-modal-backup-btn"
          onClick={() => openModal('backup')}
          icon={<Icon.Lock size="16" />}
        >
          Backup
        </Modal.SubmitAction>
      </div>
    </>
  );
}
