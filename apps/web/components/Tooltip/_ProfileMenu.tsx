'use client';

import { useEffect, useRef, useState } from 'react';
import { Tooltip } from '@social/ui-shared';
import { usePubkyClientContext } from '@/contexts';
import { UserView } from '@/types/User';
import { ButtonTooltip } from './Button';
import Modal from '../Modal';

interface TooltipProfileMenuProps {
  setShowProfileMenu: React.Dispatch<React.SetStateAction<boolean>>;
  creatorPubky: string;
  profile: UserView | null;
}

export default function ProfileMenu({
  setShowProfileMenu,
  creatorPubky,
  profile,
}: TooltipProfileMenuProps) {
  const { pubky } = usePubkyClientContext();
  const [showModalReportProfile, setShowModalReportProfile] = useState(false);
  const tooltipProfileMenuRef = useRef<HTMLDivElement>(null);
  const modalReportProfileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutsideTooltip = (event: MouseEvent) => {
      if (modalReportProfileRef.current) {
        if (!modalReportProfileRef.current.contains(event.target as Node)) {
          setShowModalReportProfile(false);
        }
        return;
      }

      if (
        tooltipProfileMenuRef.current &&
        !tooltipProfileMenuRef.current.contains(event.target as Node)
      ) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutsideTooltip);

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideTooltip);
    };
  }, [
    tooltipProfileMenuRef,
    setShowProfileMenu,
    modalReportProfileRef,
    setShowModalReportProfile,
  ]);

  return (
    <>
      <div ref={tooltipProfileMenuRef}>
        <Tooltip.Main className="px-3 py-2 bottom-0 -translate-x-[105%] translate-y-[90%] cursor-default w-[282px]">
          {creatorPubky !== pubky && (
            <ButtonTooltip.Follow
              pk={creatorPubky}
              setShowMenu={setShowProfileMenu}
            />
          )}
          {pubky === creatorPubky && (
            <ButtonTooltip.EditProfile setShowMenu={setShowProfileMenu} />
          )}
          <ButtonTooltip.CopyUserPubky
            pk={creatorPubky}
            setShowMenu={setShowProfileMenu}
          />
          <ButtonTooltip.CopyLinkProfile creatorPubky={creatorPubky} />
          {pubky !== creatorPubky && <ButtonTooltip.Mute pk={creatorPubky} />}
          {pubky !== creatorPubky && (
            <ButtonTooltip.ReportProfile
              setShowModal={setShowModalReportProfile}
            />
          )}
        </Tooltip.Main>
      </div>
      {showModalReportProfile && (
        <Modal.ReportProfile
          showModal={showModalReportProfile}
          setShowModal={setShowModalReportProfile}
          modalReportPostRef={modalReportProfileRef}
          pk={creatorPubky}
          name={profile?.details?.name}
        />
      )}
    </>
  );
}
