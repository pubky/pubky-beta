'use client';

import { usePubkyClientContext } from '@/contexts';
import { ButtonTooltip } from '../Button';

interface TooltipProfileMenuProps {
  setShowProfileMenu: React.Dispatch<React.SetStateAction<boolean>>;
  creatorPubky: string;
  name: string;
}

export default function ContentProfileMenu({ setShowProfileMenu, creatorPubky, name }: TooltipProfileMenuProps) {
  const { pubky } = usePubkyClientContext();

  return (
    <>
      {creatorPubky !== pubky && <ButtonTooltip.Follow pk={creatorPubky} setShowMenu={setShowProfileMenu} />}
      {pubky === creatorPubky && <ButtonTooltip.EditProfile setShowMenu={setShowProfileMenu} />}
      <ButtonTooltip.CopyUserPubky pk={creatorPubky} setShowMenu={setShowProfileMenu} />
      <ButtonTooltip.CopyLinkProfile creatorPubky={creatorPubky} />
      {pubky !== creatorPubky && <ButtonTooltip.Mute pk={creatorPubky} />}
      {/**pubky !== creatorPubky && (
        <ButtonTooltip.ReportProfile creatorPubky={creatorPubky} name={name} setShowMenu={setShowProfileMenu} />
      )*/}
    </>
  );
}
