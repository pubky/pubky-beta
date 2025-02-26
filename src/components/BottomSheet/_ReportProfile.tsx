'use client';

import { BottomSheet } from '@social/ui-shared';
import ContentReportProfile from '../Modal/_ReportProfile/Components/_Content';

interface ReportProfileProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  pk: string;
  name: string | undefined;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  className?: string;
}

export default function ReportProfile({ show, setShow, pk, name, setShowMenu, title, className }: ReportProfileProps) {
  return (
    <BottomSheet.Root show={show} setShow={setShow} title={title} className={className}>
      <ContentReportProfile setShowModal={setShow} pk={pk} name={name} setShowMenu={setShowMenu} />
    </BottomSheet.Root>
  );
}
