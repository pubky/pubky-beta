import { Typography, Button, Icon, SideCard } from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import Tooltip from '@/components/Tooltip';
import Parsing from '@/components/Content/_Parsing';
import { ImageByUri } from '@/components/ImageByUri';
import { usePubkyClientContext } from '@/contexts';
import { UserView } from '@/types/User';

interface UserInfoProps {
  scrolled: boolean;
  uriImage: string;
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
  uriImage,
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
  setLoadingFollowed,
}: UserInfoProps) {
  const { pubky, follow, unfollow } = usePubkyClientContext();

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

  return (
    <div
      className={`w-full self-start ${
        !scrolled ? 'hidden' : 'block sticky top-[120px]'
      } z-20 rounded-2xl px-3 py-4`}
    >
      <SideCard.Content className="flex-col gap-3 inline-flex mt-0">
        <div className="items-center inline-flex justify-between">
          <div className="justify-start items-center gap-3 inline-flex">
            <ImageByUri
              width={40}
              height={40}
              className="w-[40px] h-[40px] rounded-full"
              uri={uriImage}
              alt="user-pic"
            />
            <div>
              <Typography.Body variant="medium-bold" className="-mb-2">
                {Utils.minifyText(name, 10)}
              </Typography.Body>
              <Typography.Label className="text-[12px] text-opacity-50">
                {pubkyUser ? Utils.minifyPubky(pubkyUser) : 'Loading...'}
              </Typography.Label>
            </div>
          </div>
          <div className="relative">
            {showProfileMenu && (
              <Tooltip.ProfileMenu
                setShowProfileMenu={setShowProfileMenu}
                creatorPubky={pubkyUser}
                name={name}
              />
            )}
            <div
              className="cursor-pointer rounded-full hover:bg-white hover:bg-opacity-10 p-2 -mt-[10px]"
              onClick={() => setShowProfileMenu(true)}
            >
              <Icon.DotsThreeOutline size="16" />
            </div>
          </div>
        </div>
        <Typography.Body
          variant="small"
          className="text-opacity-80 break-words max-h-[300px] overflow-y-auto"
        >
          <Parsing>{bio}</Parsing>
        </Typography.Body>
        {initLoadingFollowed ? (
          <Button.Medium
            loading={initLoadingFollowed}
            className={
              !creatorPubky || creatorPubky === pubky
                ? 'hidden'
                : 'w-full h-[35px]'
            }
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
            className={
              !creatorPubky || creatorPubky === pubky
                ? 'hidden'
                : 'w-full h-[35px]'
            }
          >
            Unfollow
          </Button.Medium>
        ) : (
          <Button.Medium
            onClick={loadingFollowed ? undefined : () => followUser()}
            disabled={loadingFollowed}
            loading={loadingFollowed}
            variant="default"
            icon={<Icon.UserPlus size="16" />}
            className={
              !creatorPubky || creatorPubky === pubky
                ? 'hidden'
                : 'w-full h-[35px]'
            }
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
