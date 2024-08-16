import Link from 'next/link';
import { Button, Icon, PostUtil, Typography } from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import { IFollower, IUserProfile, LoadingContacts } from '@/types';
import { useClientContext } from '@/contexts';
import { ImageByUri } from '@/components/ImageByUri';

interface ContactsList {
  index: string;
  contactId: string;
  pubkeyUser: string | boolean | null;
  contact: IFollower;
  showDivider: boolean;
  initLoadingContacts: boolean;
  isFollowed: boolean;
  loadingContacts: LoadingContacts;
  profile: IUserProfile | undefined;
  followUser: (pubkyFollow: string) => Promise<void>;
  unfollowUser: (pubkyUnfollow: string) => Promise<void>;
}

export default function List({
  index,
  contactId,
  contact,
  showDivider = true,
  initLoadingContacts,
  isFollowed,
  loadingContacts,
  profile,
  pubkeyUser,
  followUser,
  unfollowUser,
}: ContactsList) {
  const { pubky, createTag, deleteTag } = useClientContext();

  const handleAddProfileTag = async (tag: string) => {
    const creatorPubky = contactId;
    const pubKeyToUse =
      (!creatorPubky || creatorPubky === pubky) && pubky ? pubky : creatorPubky;

    if (pubKeyToUse) {
      await createTag(pubKeyToUse, tag);
    }
  };

  const handleDeleteProfileTag = async (tag: string) => {
    const creatorPubky = contactId;
    const pubKeyToUse =
      (!creatorPubky || creatorPubky === pubky) && pubky ? pubky : creatorPubky;

    if (pubKeyToUse) {
      await deleteTag(pubKeyToUse, tag);
    }
  };
  return (
    <div key={index} className="w-full">
      <div className="flex-col lg:flex-row justify-start gap-4 inline-flex w-full">
        <Link
          className="flex gap-2 lg:w-[450px] xl:w-[350px]"
          href={`/profile/${contactId}`}
        >
          <ImageByUri
            width={48}
            height={48}
            uri={contact?.profile?.image || '/images/Userpic.png'}
            alt={`follower-pic-${index + 1}`}
            className="rounded-full w-[48px] h-[48px] max-w-none"
          />
          <div className="flex-col justify-center items-start inline-flex">
            <Typography.Body variant="medium-bold">
              {contact.profile.name &&
                Utils.minifyText(contact?.profile?.name, 8)}
            </Typography.Body>
            <Typography.Label className="text-opacity-30 -mt-1">
              {Utils.minifyPubky(contactId)}
            </Typography.Label>
          </div>
        </Link>
        <div className="lg:flex justify-end gap-2 items-center lg:w-full">
          {profile?.taggedAs.map((tag, index) => {
            const isTagFound = tag.from.some(
              (fromItem) => fromItem.author.id === pubky
            );

            return (
              <PostUtil.Tag
                key={index}
                clicked={isTagFound}
                onClick={(event) => {
                  event.stopPropagation();
                  isTagFound
                    ? handleDeleteProfileTag(tag.tag)
                    : handleAddProfileTag(tag.tag);
                }}
                color={tag.tag && Utils.generateRandomColor(tag.tag)}
              >
                <div className="flex gap-2 items-center">
                  {Utils.minifyText(tag.tag.replace(' ', ''), 10)}
                  <Typography.Caption
                    variant="bold"
                    className="text-opacity-30"
                  >
                    {tag.count}
                  </Typography.Caption>
                </div>
              </PostUtil.Tag>
            );
          })}
        </div>
        {profile?.tagsCount && (
          <div className="flex-col justify-start items-start gap-1 inline-flex">
            <Typography.Label className="text-[12px] text-opacity-30 -mb-1">
              Tags
            </Typography.Label>
            <Typography.Body variant="medium-bold">
              {profile?.tagsCount}
            </Typography.Body>
          </div>
        )}
        {profile?.postsCount && (
          <div className="flex-col justify-start items-start gap-1 inline-flex">
            <Typography.Label className="text-[12px] text-opacity-30 -mb-1">
              Posts
            </Typography.Label>
            <Typography.Body variant="medium-bold">
              {profile?.postsCount}
            </Typography.Body>
          </div>
        )}
        <div className="flex gap-4">
          {pubkeyUser ? (
            <Button.Medium
              className="w-[104px] bg-transparent cursor-default"
              icon={<Icon.Check />}
            >
              Me
            </Button.Medium>
          ) : initLoadingContacts ? (
            <Button.Medium disabled loading={initLoadingContacts}>
              Loading
            </Button.Medium>
          ) : isFollowed ? (
            <Button.Medium
              onClick={
                loadingContacts[contactId]
                  ? undefined
                  : () => unfollowUser(contactId)
              }
              disabled={loadingContacts[contactId]}
              loading={loadingContacts[contactId]}
              icon={<Icon.UserMinus size="16" />}
              className="w-[104px]"
            >
              Unfollow
            </Button.Medium>
          ) : (
            <Button.Medium
              onClick={
                loadingContacts[contactId]
                  ? undefined
                  : () => followUser(contactId)
              }
              disabled={loadingContacts[contactId]}
              loading={loadingContacts[contactId]}
              icon={<Icon.UserPlus size="16" />}
              className="w-[104px]"
            >
              Follow
            </Button.Medium>
          )}
        </div>
      </div>
    </div>
  );
}
