import { Typography, Button, Icon, SideCard } from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import Tooltip from '@/components/Tooltip';
import Parsing from '@/components/Content/_Parsing';
import { ImageByUri } from '@/components/ImageByUri';
import { useAlertContext, useModal, usePubkyClientContext } from '@/contexts';
import { UserView } from '@/types/User';

interface UserInfoProps {
  scrolled: boolean;
  name: string;
  creatorPubky: string | null | undefined;
  pubkyUser: string;
  showProfileMenu: boolean;
  setShowProfileMenu: React.Dispatch<React.SetStateAction<boolean>>;
  bio: string;
  profile: UserView | null;
  initLoadingFollowed: boolean;
  followed: boolean;
  setFollowed: React.Dispatch<React.SetStateAction<boolean>>;
  loadingFollowed: boolean;
  setLoadingFollowed: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function UserInfo({
  scrolled,
  name,
  creatorPubky,
  pubkyUser,
  setShowProfileMenu,
  profile,
  showProfileMenu,
  bio,
  initLoadingFollowed,
  followed,
  setFollowed,
  loadingFollowed,
  setLoadingFollowed
}: UserInfoProps) {
  const { pubky, follow, unfollow } = usePubkyClientContext();
  const { addAlert } = useAlertContext();
  const { openModal } = useModal();

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

  return (
    <div
      className={`w-full self-start ${!scrolled ? 'hidden' : 'block sticky top-[120px]'} z-20 rounded-2xl px-3 py-4`}
    >
      <SideCard.Content className="flex-col gap-3 inline-flex mt-0">
        <div className="items-center inline-flex justify-between">
          <div className="justify-start items-center gap-2 inline-flex">
            <ImageByUri
              id={pubkyUser}
              width={32}
              height={32}
              className="w-[32px] h-[32px] rounded-full"
              alt="user-pic"
            />
            <div>
              <div className="w-full gap-2 justify-between flex items-center">
                <div className="flex flex-col justify-center">
                  <Typography.Body variant="small-bold" className="leadning-none">
                    {Utils.minifyText(name, 8)}
                  </Typography.Body>
                  <Typography.Label className="text-[11px] leading-none text-opacity-30">
                    {Utils.minifyPubky(pubkyUser)}
                  </Typography.Label>
                </div>
                <div className="relative">
                  {showProfileMenu && (
                    <Tooltip.ProfileMenu
                      setShowProfileMenu={setShowProfileMenu}
                      creatorPubky={pubkyUser}
                      profile={profile}
                    />
                  )}
                  <div
                    className="cursor-pointer rounded-full"
                    onClick={() => (pubky ? setShowProfileMenu(true) : openModal('join'))}
                  >
                    <Icon.DotsThreeOutline size="12" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Typography.Body variant="small" className="text-opacity-80 break-words">
          <Parsing>{bio}</Parsing>
        </Typography.Body>
        {initLoadingFollowed ? (
          <Button.Medium
            loading={initLoadingFollowed}
            className={!creatorPubky || creatorPubky === pubky ? 'hidden' : 'w-full h-[35px]'}
          >
            Loading
          </Button.Medium>
        ) : followed ? (
          <Button.Medium
            onClick={loadingFollowed ? undefined : () => unfollowUser()}
            disabled={loadingFollowed}
            loading={loadingFollowed}
            variant="default"
            icon={<Icon.UserMinus size="16" />}
            className={!creatorPubky || creatorPubky === pubky ? 'hidden' : 'w-full h-[35px]'}
          >
            Unfollow
          </Button.Medium>
        ) : (
          <Button.Medium
            onClick={loadingFollowed ? undefined : () => (pubky ? followUser() : openModal('join'))}
            disabled={loadingFollowed}
            loading={loadingFollowed}
            variant="default"
            icon={<Icon.UserPlus size="16" />}
            className={!creatorPubky || creatorPubky === pubky ? 'hidden' : 'w-full h-[35px]'}
          >
            Follow
          </Button.Medium>
        )}
        {/* {(!creatorPubky || creatorPubky === pubky) && (
          <Link href="/settings">
            <Button.Medium
              variant="default"
              icon={<Icon.Pencil size="16" />}
            >
              Edit profile
            </Button.Medium>
          </Link>
        )} */}
      </SideCard.Content>
    </div>
  );
}
