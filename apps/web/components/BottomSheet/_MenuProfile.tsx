'use client';

import { BottomSheet as BottomSheetUI } from '@social/ui-shared';
import { ButtonTooltip } from '../Tooltip/Button';
import { usePubkyClientContext } from '@/contexts';
import { useState } from 'react';
import { UserView } from '@/types/User';
import { BottomSheet } from '.';

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
  const { pubky } = usePubkyClientContext();
  const [showSheetReportProfile, setShowSheetReportProfile] = useState(false);

  return (
    <BottomSheetUI.Root
      show={show}
      setShow={setShow}
      title={title}
      className={className}
    >
      {creatorPubky !== pubky && (
        <ButtonTooltip.Follow pk={creatorPubky} setShowMenu={setShow} />
      )}
      {pubky === creatorPubky && (
        <ButtonTooltip.EditProfile setShowMenu={setShow} />
      )}
      <ButtonTooltip.CopyUserPubky pk={creatorPubky} setShowMenu={setShow} />
      <ButtonTooltip.CopyLinkProfile creatorPubky={creatorPubky} />
      {pubky !== creatorPubky && <ButtonTooltip.Mute pk={creatorPubky} />}
      {pubky !== creatorPubky && (
        <ButtonTooltip.ReportProfile setShowModal={setShowSheetReportProfile} />
      )}
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
