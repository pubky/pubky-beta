import { Button, Icon } from '@social/ui-shared';
import { usePubkyClientContext, useToastContext } from '@/contexts';
import { useRouter } from 'next/navigation';
import { Utils } from '@social/utils-shared';
import Tooltip from '@/components/Tooltip';
import { UserView } from '@/types/User';
import Link from 'next/link';

interface ButtonsProps extends React.HTMLAttributes<HTMLDivElement> {
  creatorPubky: string | null | undefined;
  pubkey: string;
  initLoadingFollowed: boolean;
  followed: boolean;
  loadingFollowed: boolean;
  disposableAccount: boolean;
  showProfileMenu: boolean;
  setShowProfileMenu: React.Dispatch<React.SetStateAction<boolean>>;
  setShowModalLogout: React.Dispatch<React.SetStateAction<boolean>>;
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
  showProfileMenu,
  setShowProfileMenu,
  setShowModalLogout,
  setLoadingFollowed,
  setFollowed,
  profile,
}: ButtonsProps) {
  const { pubky, follow, unfollow } = usePubkyClientContext();
  const { setContent, setShow } = useToastContext();
  const router = useRouter();

  const followUser = async () => {
    try {
      if (!creatorPubky) return;
      setLoadingFollowed(true);

      const result = await follow(creatorPubky);
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
      setFollowed(!result);
      setLoadingFollowed(false);
    } catch (error) {
      console.log(error);
    }
  };

  const copyProfileUrlToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/profile/${pubkey}`,
      );
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

  return (
    <>
      {creatorPubky && (
        <>
          {initLoadingFollowed ? (
            <Button.Large
              loading={initLoadingFollowed}
              className={
                !creatorPubky || creatorPubky === pubky
                  ? 'hidden'
                  : 'w-auto h-8 px-3 py-2'
              }
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
              className={
                !creatorPubky || creatorPubky === pubky
                  ? 'hidden'
                  : 'w-auto h-8 px-3 py-2'
              }
            >
              Unfollow
            </Button.Large>
          ) : (
            <Button.Large
              id="profile-follow-btn"
              onClick={loadingFollowed ? undefined : () => followUser()}
              disabled={loadingFollowed}
              loading={loadingFollowed}
              icon={<Icon.UserPlus size="16" />}
              className={
                !creatorPubky || creatorPubky === pubky
                  ? 'hidden'
                  : 'w-auto h-8 px-3 py-2'
              }
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
            className="px-3 w-21 h-8"
            onClick={
              disposableAccount
                ? () => setShowModalLogout(true)
                : () => router.push('/logout')
            }
            icon={<Icon.SignOut />}
          >
            Sign out
          </Button.Medium>
          <Link href="/settings/edit">
            <Button.Medium
              id="profile-edit-btn"
              className="px-3 w-auto h-8"
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
          setContent(`pk:${pubkey}`, 'pubky');
          setShow(true);
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
          setContent(`${window.location.origin}/profile/${pubkey}`, 'link');
          setShow(true);
          copyProfileUrlToClipboard();
        }}
        icon={<Icon.Link size="14" />}
      >
        Link
      </Button.Medium>
      <div className="relative">
        {showProfileMenu && (
          <Tooltip.ProfileMenu
            setShowProfileMenu={setShowProfileMenu}
            creatorPubky={creatorPubky ?? pubkey}
            profile={profile}
          />
        )}
        <Button.Action
          size="small"
          variant="custom"
          icon={<Icon.DotsThreeOutline size="16" />}
          onClick={() => setShowProfileMenu(true)}
        />
      </div>
    </>
  );
}
