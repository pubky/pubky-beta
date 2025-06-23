'use client';

import { BottomSheet } from '@social/ui-shared';
import ContentRepostedUsers from '../Modal/_RepostedUsers/_Content';

interface RepostedUsersProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  users: string[];
  title?: string;
  className?: string;
}

export default function RepostedUsers({ show, setShow, users, title, className }: RepostedUsersProps) {
  return (
    <BottomSheet.Root show={show} setShow={setShow} title={title ?? 'Users who reposted'} className={className}>
      <ContentRepostedUsers users={users} />
    </BottomSheet.Root>
  );
}
