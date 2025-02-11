'use client';

import { twMerge } from 'tailwind-merge';
import { Typography } from '@social/ui-shared';
import { useEffect, useState } from 'react';
import Modal from '@/components/Modal';
import { Utils } from '@social/utils-shared';
import Buttons from './_Buttons';
import Status from './_Status';
import { usePubkyClientContext } from '@/contexts';
import { UserView } from '@/types/User';
import { TStatus } from '@/types';
import Parsing from '@/components/Content/_Parsing';
import { BottomSheet } from '@/components';

interface HandleProps extends React.HTMLAttributes<HTMLDivElement> {
  pubkey: string;
  profileUser: UserView | null;
  creatorPubky?: string | null;
}

export default function Handle({
  pubkey,
  profileUser,
  creatorPubky,
  ...rest
}: HandleProps) {
  const { seed, profile } = usePubkyClientContext();
  const [disposableAccount, setDisposableAccount] = useState(false);
  const [showModalLogout, setShowModalLogout] = useState(false);
  const [showSheetLogout, setShowSheetLogout] = useState(false);
  const [followed, setFollowed] = useState(false);
  const [initLoadingFollowed, setInitLoadingFollowed] = useState(true);
  const [loadingFollowed, setLoadingFollowed] = useState(false);
  const username = creatorPubky ? profileUser?.details?.name : profile?.name;
  const bio = creatorPubky ? profileUser?.details?.bio : profile?.bio;
  const status = creatorPubky ? profileUser?.details?.status : profile?.status;

  useEffect(() => {
    async function fetchData() {
      try {
        if (profileUser) {
          setInitLoadingFollowed(false);
          if (profileUser?.relationship?.following) setFollowed(true);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileUser, creatorPubky]);

  useEffect(() => {
    if (seed) {
      setDisposableAccount(true);
    } else {
      setDisposableAccount(false);
    }
  }, [seed]);

  return (
    <div {...rest} className={twMerge(rest.className)}>
      {pubkey ? (
        <>
          <div className="text-center lg:text-left flex flex-col gap-2 mb-4 md:mb-7">
            <Typography.Display
              id="profile-username-header"
              className="text-2xl sm:text-2xl sm:leading-[3.2rem] xl:leading-7"
            >
              {Utils.minifyText(
                username?.toString() || Utils.minifyPubky(pubkey),
                25,
              )}
            </Typography.Display>
            <Typography.Body
              variant="medium"
              className="text-opacity-80 md:hidden"
            >
              <Parsing>{bio || 'No bio.'}</Parsing>
            </Typography.Body>
          </div>
          <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
            <Buttons
              creatorPubky={creatorPubky}
              pubkey={pubkey}
              initLoadingFollowed={initLoadingFollowed}
              followed={followed}
              loadingFollowed={loadingFollowed}
              disposableAccount={disposableAccount}
              setShowModalLogout={setShowModalLogout}
              setShowSheetLogout={setShowSheetLogout}
              setLoadingFollowed={setLoadingFollowed}
              setFollowed={setFollowed}
              profile={profileUser}
            />
            <Status
              creatorPubky={creatorPubky}
              status={(status || 'noStatus') as TStatus}
            />
          </div>
        </>
      ) : (
        <Typography.Display className="text-left">
          Loading...
        </Typography.Display>
      )}
      <Modal.Logout
        showModalLogout={showModalLogout}
        setShowModalLogout={setShowModalLogout}
      />
      <BottomSheet.Logout show={showSheetLogout} setShow={setShowSheetLogout} />
    </div>
  );
}
