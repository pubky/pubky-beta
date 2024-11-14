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

interface HandleProps extends React.HTMLAttributes<HTMLDivElement> {
  pubkey: string;
  profile: UserView | null;
  creatorPubky?: string | null;
}

export default function Handle({
  pubkey,
  profile,
  creatorPubky,
  ...rest
}: HandleProps) {
  const { seed } = usePubkyClientContext();
  const [disposableAccount, setDisposableAccount] = useState(false);
  const [showModalLogout, setShowModalLogout] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [followed, setFollowed] = useState(false);
  const [initLoadingFollowed, setInitLoadingFollowed] = useState(true);
  const [loadingFollowed, setLoadingFollowed] = useState(false);
  const username = profile?.details?.name || 'Loading...';
  const bio = profile?.details?.bio || 'No bio.';
  const status = profile?.details?.status || 'noStatus';

  useEffect(() => {
    async function fetchData() {
      try {
        if (profile) {
          setInitLoadingFollowed(false);
          if (profile?.relationship?.following) setFollowed(true);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, creatorPubky]);

  useEffect(() => {
    if (seed) {
      setDisposableAccount(true);
    } else {
      setDisposableAccount(false);
    }
  }, [seed]);

  return (
    <div {...rest} className={twMerge(rest.className)}>
      {username && pubkey ? (
        <>
          <div className="text-center lg:text-left flex flex-col gap-2 mb-4 md:mb-9">
            <Typography.Display
              id="profile-username-header"
              className="text-2xl sm:text-2xl"
            >
              {Utils.minifyText(username.toString(), 15)}
            </Typography.Display>
            {bio && (
              <Typography.Body
                variant="medium"
                className="text-opacity-80 md:hidden"
              >
                {Utils.minifyText(bio.toString(), 30)}
              </Typography.Body>
            )}
          </div>
          <div className="md:-mt-4 flex flex-wrap gap-3 justify-center md:justify-start">
            <Buttons
              creatorPubky={creatorPubky}
              pubkey={pubkey}
              initLoadingFollowed={initLoadingFollowed}
              followed={followed}
              loadingFollowed={loadingFollowed}
              disposableAccount={disposableAccount}
              showProfileMenu={showProfileMenu}
              setShowModalLogout={setShowModalLogout}
              setLoadingFollowed={setLoadingFollowed}
              setFollowed={setFollowed}
              setShowProfileMenu={setShowProfileMenu}
              username={username as string}
            />
            <Status creatorPubky={creatorPubky} status={status} />
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
    </div>
  );
}
