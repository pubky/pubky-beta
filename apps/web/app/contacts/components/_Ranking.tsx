import { useRouter } from 'next/navigation';
import { Button, Content, Icon, Typography } from '@social/ui-shared';
import Image from 'next/image';
import { Utils } from '@social/utils-shared';
import { Contacts } from '.';
import { IFollower, LoadingContacts } from '../../../types';

interface ContactsRanking {
  index: string;
  contactId: string;
  contact: IFollower;
  initLoadingContacts: boolean;
  isFollowed: boolean;
  showDivider: boolean;
  loadingContacts: LoadingContacts;
  followUser: (pubkyFollow: string) => Promise<void>;
  unfollowUser: (pubkyUnfollow: string) => Promise<void>;
}

export default function Ranking({
  index,
  contactId,
  contact,
  initLoadingContacts,
  isFollowed,
  showDivider = true,
  loadingContacts,
  followUser,
  unfollowUser,
}: ContactsRanking) {
  const router = useRouter();
  return (
    <div key={index} className="mt-12 mb-12">
      <div className="flex flex-col lg:flex-row gap-12">
        <div
          onClick={() => router.push(`/profile/${contactId}`)}
          className="w-[350px] cursor-pointer flex-col gap-6 inline-flex"
        >
          <div className="gap-6 inline-flex">
            <div className="relative">
              <Image
                width={201}
                height={201}
                className="w-full h-full rounded-full"
                src={contact?.profile?.image || '/images/Userpic.png'}
                alt={`contact-pic-${index + 1}`}
              />
            </div>
            <div className="flex-col gap-6 inline-flex">
              <div className="flex-col gap-1 flex">
                <Typography.Label className="text-opacity-50 leading-none">
                  Followers
                </Typography.Label>
                <Typography.H1 className="leading-[46px]">
                  {contact?.followersCount}
                </Typography.H1>
              </div>
              <div className="flex-col gap-1 flex">
                <Typography.Label className="text-opacity-50 leading-none">
                  Following
                </Typography.Label>
                <Typography.H1 className="leading-[46px]">
                  {contact?.followingCount}
                </Typography.H1>
              </div>
            </div>
          </div>
          <div className="flex-col gap-1 flex">
            <Typography.H2>{contact.profile.name}</Typography.H2>
            <Typography.Label className="text-opacity-50">
              {Utils.minifyPubky(contactId)}
            </Typography.Label>
            {initLoadingContacts ? (
              <Button.Medium
                className="mt-4 lg:w-[50%]"
                disabled
                loading={initLoadingContacts}
              >
                Loading
              </Button.Medium>
            ) : isFollowed ? (
              <Button.Medium
                onClick={(event) => {
                  event.stopPropagation();
                  if (!loadingContacts[contactId]) {
                    unfollowUser(contactId);
                  }
                }}
                disabled={loadingContacts[contactId]}
                loading={loadingContacts[contactId]}
                icon={<Icon.UserMinus size="16" />}
                className="mt-4 lg:w-[50%]"
              >
                Unfollow
              </Button.Medium>
            ) : (
              <Button.Medium
                onClick={(event) => {
                  event.stopPropagation();
                  if (!loadingContacts[contactId]) {
                    followUser(contactId);
                  }
                }}
                disabled={loadingContacts[contactId]}
                loading={loadingContacts[contactId]}
                icon={<Icon.UserPlus size="16" />}
                className="mt-4 lg:w-[50%]"
              >
                Follow
              </Button.Medium>
            )}
          </div>
        </div>
        <Contacts.Posts creatorPubky={contactId} />
      </div>
      {showDivider && <Content.Divider />}
    </div>
  );
}
