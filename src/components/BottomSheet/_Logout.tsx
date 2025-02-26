'use client';

import { BottomSheet } from '@social/ui-shared';
import ContentLogout from '../Modal/_Logout/_Content';

interface LogoutProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  className?: string;
}

export default function Logout({ show, setShow, title, className }: LogoutProps) {
  return (
    <BottomSheet.Root show={show} setShow={setShow} title={title ?? 'Sign out?'} className={className}>
      <ContentLogout />
    </BottomSheet.Root>
  );
}
