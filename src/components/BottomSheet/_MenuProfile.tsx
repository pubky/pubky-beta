'use client';

import { BottomSheet as BottomSheetUI } from '@social/ui-shared';
import ContentProfileMenu from '../Tooltip/_MenuProfile/_Content';

interface MenuProfileProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  creatorPubky: string;
  name: string;
  title?: string;
  className?: string;
}

export default function MenuProfile({ show, setShow, creatorPubky, name, title, className }: MenuProfileProps) {
  return (
    <BottomSheetUI.Root show={show} setShow={setShow} title={title} className={className}>
      <ContentProfileMenu setShowProfileMenu={setShow} creatorPubky={creatorPubky} name={name} />
    </BottomSheetUI.Root>
  );
}
