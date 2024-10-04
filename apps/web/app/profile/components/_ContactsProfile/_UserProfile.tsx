// components/UserProfile.tsx
import { useUserProfile } from '@/hooks/useUser';
import { ImageByUri } from '@/components/ImageByUri';
import { Button, Icon, PostUtil, Typography } from '@social/ui-shared';
import Link from 'next/link';
import { Utils } from '@social/utils-shared';
import { usePubkyClientContext } from '@/contexts';

export const UserProfile = ({
  contact,
  isLoading,
}: {
  contact: string;
  isLoading: false;
}) => {
  const { pubky } = usePubkyClientContext();
  const { data: profile } = useUserProfile(contact, pubky ?? '');

  if (!profile) return null;

  const pubkeyUser = pubky && profile?.details?.id.includes(pubky);
  const contactId = profile?.details?.id.replace('pubky:', '');
  //const isFollowed = followed[contactId] || false;
  //const profile = profiles[contactId];

  return (
    <div className="w-full">
      <div className="w-full">
        <div className="flex-col lg:flex-row justify-start gap-4 inline-flex w-full">
          <Link className="flex gap-2 w-full" href={`/profile/${contactId}`}>
            <ImageByUri
              width={48}
              height={48}
              uri={profile?.details?.image || '/images/Userpic.png'}
              alt={`profile-pic-${contactId}`}
              className="rounded-full w-[48px] h-[48px] max-w-none"
            />
            <div className="flex-col justify-center items-start inline-flex">
              <Typography.Body variant="medium-bold">
                {profile?.details.name &&
                  Utils.minifyText(profile?.details?.name, 8)}
              </Typography.Body>
              <Typography.Label className="text-opacity-30 -mt-1">
                {profile?.details?.id &&
                  Utils.minifyPubky(profile?.details?.id)}
              </Typography.Label>
            </div>
          </Link>
          <div className="lg:flex justify-end gap-2 items-center lg:w-full">
            {profile?.tags?.slice(0, 3).map((tag, index) => {
              //const isTagFound = tag.from.some(
              // (fromItem) => fromItem === pubky
              // );

              return (
                <PostUtil.Tag
                  key={index}
                  clicked={false}
                  //onClick={(event) => {
                  //  event.stopPropagation();
                  //  isTagFound
                  //</div>    ? handleDeleteProfileTag(tag.tag)
                  //    : handleAddProfileTag(tag.tag);
                  //}}
                  color={tag?.label && Utils.generateRandomColor(tag?.label)}
                >
                  <div className="flex gap-2 items-center">
                    {Utils.minifyText(tag?.label.replace(' ', ''), 10)}
                    <Typography.Caption
                      variant="bold"
                      className="text-opacity-30"
                    >
                      {tag?.tagged?.length}
                    </Typography.Caption>
                  </div>
                </PostUtil.Tag>
              );
            })}
          </div>
          <div className="flex-col justify-start items-start gap-1 inline-flex">
            <Typography.Label className="text-[12px] text-opacity-30 -mb-1">
              Tags
            </Typography.Label>
            <Typography.Body variant="medium-bold">
              {profile?.counts?.tags ?? 0}
            </Typography.Body>
          </div>
          <div className="flex-col justify-start items-start gap-1 inline-flex">
            <Typography.Label className="text-[12px] text-opacity-30 -mb-1">
              Posts
            </Typography.Label>
            <Typography.Body variant="medium-bold">
              {profile?.counts?.posts ?? 0}
            </Typography.Body>
          </div>
          <div className="flex gap-4">
            {pubkeyUser ? (
              <Button.Medium
                className="w-[104px] bg-transparent cursor-default"
                icon={<Icon.Check />}
              >
                Me
              </Button.Medium>
            ) : isLoading ? (
              <Button.Medium disabled loading={isLoading}>
                Loading
              </Button.Medium>
            ) : profile?.relationship?.followed_by ? (
              <Button.Medium
                //onClick={
                //  loadingContacts[contactId]
                //   ? undefined
                //   : () => unfollowUser(contactId)
                //}
                //disabled={loadingContacts[contactId]}
                //loading={loadingContacts[contactId]}
                icon={<Icon.UserMinus size="16" />}
                className="w-[104px]"
              >
                Unfollow
              </Button.Medium>
            ) : (
              <Button.Medium
                //onClick={
                //  loadingContacts[contactId]
                //   ? undefined
                //   : () => followUser(contactId)
                //}
                //disabled={loadingContacts[contactId]}
                //loading={loadingContacts[contactId]}
                icon={<Icon.UserPlus size="16" />}
                className="w-[104px]"
              >
                Follow
              </Button.Medium>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
