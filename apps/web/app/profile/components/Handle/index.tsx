import { twMerge } from 'tailwind-merge';
import { Typography } from '@social/ui-shared';
import { useEffect, useState } from 'react';
import Modal from '@/components/Modal';
import { Utils } from '@social/utils-shared';
import { TStatus } from '@/types';
import Buttons from './_Buttons';
import Status from './_Status';
import { usePubkyClientContext } from '@/contexts';
import { useUserStream } from '@/hooks/useUser';

interface HandleProps extends React.HTMLAttributes<HTMLDivElement> {
  username: string | JSX.Element;
  pubkey: string;
  creatorPubky?: string | null;
  status?: TStatus;
}

export default function Handle({
  username,
  pubkey,
  creatorPubky,
  status,
  ...rest
}: HandleProps) {
  const { pubky, seed } = usePubkyClientContext();
  const { data: followers } = useUserStream(pubkey, pubky, 0, 10, 'followers');

  const [disposableAccount, setDisposableAccount] = useState(false);
  const [showModalLogout, setShowModalLogout] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [followed, setFollowed] = useState(false);
  const [initLoadingFollowed, setInitLoadingFollowed] = useState(true);
  const [loadingFollowed, setLoadingFollowed] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        let pubkey = creatorPubky;

        if (!pubkey) {
          pubkey = pubky;
        }

        if (!pubkey) return;

        const followersList = followers?.users;

        if (followersList) {
          setInitLoadingFollowed(false);

          followersList.map((user) => {
            const id = user.details.id;
            if (id === pubky) {
              setFollowed(true);
            }
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [followers, creatorPubky]);

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
          <Typography.Display
            id="profile-username-header"
            className="text-center md:text-left mb-4"
          >
            {Utils.minifyText(username.toString(), 15)}
          </Typography.Display>
          <div className="md:-mt-4 flex flex-col md:flex-row gap-3">
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
