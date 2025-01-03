'use client';

import { BottomSheet, Button, Icon, Typography } from '@social/ui-shared';
import Link from 'next/link';

interface LogoutProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  className?: string;
}

export default function Logout({
  show,
  setShow,
  title,
  className,
}: LogoutProps) {
  return (
    <BottomSheet.Root
      show={show}
      setShow={setShow}
      title={title ?? 'Sign out?'}
      className={className}
    >
      <Typography.Body
        className="text-left text-opacity-60 my-4"
        variant="medium"
      >
        If you sign out without backup you will no longer be able to login.
      </Typography.Body>
      <div className="flex gap-4 mt-2">
        <Link className="w-full" href="/logout">
          <Button.Large
            id="logout-modal-sign-out-btn"
            variant="secondary"
            icon={<Icon.SignOut size="16" />}
          >
            Yes, sign out
          </Button.Large>
        </Link>
        <Link className="w-full" href="/settings">
          <Button.Large
            id="logout-modal-backup-btn"
            icon={<Icon.Lock size="16" />}
          >
            Backup
          </Button.Large>
        </Link>
      </div>
    </BottomSheet.Root>
  );
}
