import Link from 'next/link';
import { Button, Content, Icon, Typography } from '@social/ui-shared';
import Image from 'next/image';
import { minifyPubky } from '../../../libs/pubkyHelper';
import { Contacts } from '.';
import { IFollower, LoadingContacts, ContactInfoProps } from '../../../types';

interface ContactsRanking {
  index: number;
  contactId: string;
  contact: IFollower;
  contactsLength: number;
  countFollowers?: number;
  countFollowing?: number;
  initLoadingContacts: boolean;
  isFollowed: boolean;
  loadingContacts: LoadingContacts;
  followUser: (pubkyFollow: string) => Promise<void>;
  unfollowUser: (pubkyUnfollow: string) => Promise<void>;
}

const ContactInfo = ({ label, value, loading }: ContactInfoProps) => (
  <div className="flex-col gap-1 flex">
    <Typography.Label className="text-opacity-50 leading-none">
      {label}
    </Typography.Label>
    {loading ? (
      <Icon.LoadingSpin />
    ) : (
      <Typography.H1 className="leading-[46px]">{value}</Typography.H1>
    )}
  </div>
);

export default function Ranking({
  index,
  contactId,
  contact,
  contactsLength,
  countFollowers,
  countFollowing,
  initLoadingContacts,
  isFollowed,
  loadingContacts,
  followUser,
  unfollowUser,
}: ContactsRanking) {
  return (
    <div key={index} className="mt-12 mb-12">
      <div className="flex flex-col lg:flex-row gap-12">
        <Link
          href={`/profile/${contactId}`}
          className="w-[350px] flex-col gap-6 inline-flex"
        >
          <div className="gap-6 inline-flex">
            <div className="relative">
              <Image
                width={201}
                height={201}
                className="rounded-full"
                src={contact?.profile?.image || '/images/Userpic.png'}
                alt={`contact-pic-${index + 1}`}
              />
            </div>
            <div className="flex-col gap-6 inline-flex">
              <ContactInfo
                label="Followers"
                value={countFollowers}
                loading={initLoadingContacts}
              />
              <ContactInfo
                label="Following"
                value={countFollowing}
                loading={initLoadingContacts}
              />
            </div>
          </div>
          <div className="flex-col gap-1 flex">
            <Typography.H2>{contact.profile.name}</Typography.H2>
            <Typography.Label className="text-opacity-50">
              {minifyPubky(contactId)}
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
                  event.preventDefault();
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
                  event.preventDefault();
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
        </Link>
        <Contacts.Posts creatorPubky={contactId} />
      </div>
      {index !== contactsLength - 1 && <Content.Divider />}
    </div>
  );
}
