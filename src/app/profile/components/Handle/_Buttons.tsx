import { Button, Icon } from '@social/ui-shared';
import { useAlertContext, useModal, usePubkyClientContext, useToastContext } from '@/contexts';
import { useRouter } from 'next/navigation';
import { Utils } from '@social/utils-shared';
import Tooltip from '@/components/Tooltip';
import { UserView } from '@/types/User';
import Link from 'next/link';
import { useState } from 'react';
import { useIsMobile } from '@/hooks/useIsMobile';

interface ButtonsProps extends React.HTMLAttributes<HTMLDivElement> {
  creatorPubky: string | null | undefined;
  pubkey: string;
  initLoadingFollowed: boolean;
  followed: boolean;
  loadingFollowed: boolean;
  disposableAccount: boolean;
  setLoadingFollowed: React.Dispatch<React.SetStateAction<boolean>>;
  setFollowed: React.Dispatch<React.SetStateAction<boolean>>;
  profile: UserView | null;
}

export default function Buttons({
  creatorPubky,
  pubkey,
  initLoadingFollowed,
  followed,
  loadingFollowed,
  disposableAccount,
  setLoadingFollowed,
  setFollowed,
  profile
}: ButtonsProps) {
  const { pubky, follow, unfollow } = usePubkyClientContext();
  const { openModal } = useModal();
  const isMobile = useIsMobile();
  const { addToast } = useToastContext();
  const { addAlert } = useAlertContext();
  const router = useRouter();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const followUser = async () => {
    try {
      if (!creatorPubky) return;
      setLoadingFollowed(true);

      const result = await follow(creatorPubky);

      if (!result) {
        addAlert('Something went wrong!', 'warning');
      }

      setFollowed(result);
      setLoadingFollowed(false);
    } catch (error) {
      console.log(error);
    }
  };

  const unfollowUser = async () => {
    try {
      if (!creatorPubky) return;
      setLoadingFollowed(true);

      const result = await unfollow(creatorPubky);

      if (!result) {
        addAlert('Something went wrong!', 'warning');
      }

      setFollowed(!result);
      setLoadingFollowed(false);
    } catch (error) {
      console.log(error);
    }
  };

  const copyProfileUrlToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/profile/${pubkey}`);
    } catch (error) {
      console.log('Failed to copy: ', error);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`pk:${pubkey}`);
    } catch (error) {
      console.log('Failed to copy: ', error);
    }
  };

  const handleLogoutClick = () => {
    if (disposableAccount) {
      openModal('logout');
    } else {
      router.push('/logout');
    }
  };

  return (
    <>
      {creatorPubky && (
        <>
          {initLoadingFollowed ? (
            <Button.Large
              loading={initLoadingFollowed}
              className={!creatorPubky || creatorPubky === pubky ? 'hidden' : 'w-auto h-8 px-3 py-2'}
            >
              Loading
            </Button.Large>
          ) : followed ? (
            <Button.Large
              id="profile-unfollow-btn"
              onClick={loadingFollowed ? undefined : () => unfollowUser()}
              disabled={loadingFollowed}
              loading={loadingFollowed}
              icon={<Icon.UserMinus size="16" />}
              className={!creatorPubky || creatorPubky === pubky ? 'hidden' : 'w-auto h-8 px-3 py-2'}
            >
              Unfollow
            </Button.Large>
          ) : (
            <Button.Large
              id="profile-follow-btn"
              onClick={loadingFollowed ? undefined : () => (pubky ? followUser() : openModal('join'))}
              disabled={loadingFollowed}
              loading={loadingFollowed}
              icon={<Icon.UserPlus size="16" />}
              className={!creatorPubky || creatorPubky === pubky ? 'hidden' : 'w-auto h-8 px-3 py-2'}
            >
              Follow
            </Button.Large>
          )}
        </>
      )}
      {(!creatorPubky || creatorPubky === pubky) && (
        <>
          <Button.Medium
            id="profile-sign-out-btn"
            className="px-3 w-21 h-8 hidden lg:flex"
            onClick={handleLogoutClick}
            icon={<Icon.SignOut />}
          >
            Sign out
          </Button.Medium>
          <Link href="/settings/edit">
            <Button.Medium
              id="profile-edit-btn"
              className="px-3 w-auto h-8 hidden lg:flex"
              icon={<Icon.Pencil size="16" />}
            >
              Edit
            </Button.Medium>
          </Link>
        </>
      )}
      <Button.Medium
        id="profile-copy-pubkey-btn"
        className="px-3 w-auto h-8 uppercase"
        onClick={() => {
          addToast(`pk:${pubkey}`, 'pubky');
          copyToClipboard();
        }}
        icon={<Icon.Key size="16" />}
      >
        {Utils.minifyPubky(pubkey)}
      </Button.Medium>
      <Button.Medium
        id="profile-copy-link-btn"
        className="px-3 w-auto h-8"
        onClick={() => {
          addToast(`${window.location.origin}/profile/${pubkey}`, 'link');
          copyProfileUrlToClipboard();
        }}
        icon={<Icon.Link size="14" />}
      >
        Link
      </Button.Medium>
      {creatorPubky && creatorPubky !== pubky && (
        <div className="relative">
          {showProfileMenu && (
            <Tooltip.ProfileMenu
              setShowProfileMenu={setShowProfileMenu}
              creatorPubky={creatorPubky ?? pubkey}
              profile={profile}
            />
          )}
          <Button.Action
            id="profile-menu-btn"
            size="small"
            variant="custom"
            icon={<Icon.DotsThreeOutline size="16" />}
            onClick={() =>
              pubky
                ? isMobile
                  ? openModal('menuProfile', {
                      creatorPubky: creatorPubky,
                      name: profile?.details?.name
                    })
                  : setShowProfileMenu(!showProfileMenu)
                : openModal('join')
            }
          />
        </div>
      )}
    </>
  );
}
