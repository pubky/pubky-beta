'use client';

import { BottomSheet as BottomSheetUI } from '@social/ui-shared';
import { useState } from 'react';
import { UserView } from '@/types/User';
import { BottomSheet } from '.';
import ContentProfileMenu from '../Tooltip/_MenuProfile/_Content';

interface MenuProfileProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  creatorPubky: string;
  profile: UserView | null;
  title?: string;
  className?: string;
}

export default function MenuProfile({
  show,
  setShow,
  creatorPubky,
  profile,
  title,
  className,
}: MenuProfileProps) {
  const [showSheetReportProfile, setShowSheetReportProfile] = useState(false);

  return (
    <BottomSheetUI.Root
      show={show}
      setShow={setShow}
      title={title}
      className={className}
    >
      <ContentProfileMenu
        setShowProfileMenu={setShow}
        setShowModalReportProfile={setShowSheetReportProfile}
        creatorPubky={creatorPubky}
      />
      {showSheetReportProfile && (
        <BottomSheet.ReportProfile
          show={showSheetReportProfile}
          setShow={setShowSheetReportProfile}
          pk={creatorPubky}
          name={profile?.details?.name}
        />
      )}
    </BottomSheetUI.Root>
  );
}
