import Link from 'next/link';
import { Button, Content, Icon, Typography } from '@social/ui-shared';
import Image from 'next/image';
import { minifyPubky } from '../../../libs/pubkyHelper';
import { IFollower, LoadingContacts } from '../../../types';

interface ContactsList {
  index: number;
  contactId: string;
  pubkeyUser: string | boolean | null;
  contact: IFollower;
  contactsLength: number;
  initLoadingContacts: boolean;
  isFollowed: boolean;
  loadingContacts: LoadingContacts;
  followUser: (pubkyFollow: string) => Promise<void>;
  unfollowUser: (pubkyUnfollow: string) => Promise<void>;
}

export default function List({
  index,
  contactId,
  contact,
  contactsLength,
  initLoadingContacts,
  isFollowed,
  loadingContacts,
  pubkeyUser,
  followUser,
  unfollowUser,
}: ContactsList) {
  return (
    <div key={index} className="w-full">
      <div className="flex-col lg:flex-row justify-start gap-4 inline-flex w-full">
        <Link
          className="flex gap-4 lg:w-[450px] xl:w-[350px]"
          href={`/profile/${contactId}`}
        >
          <Image
            width={48}
            height={48}
            src={contact?.profile?.image || '/images/Userpic.png'}
            alt={`follower-pic-${index + 1}`}
            className="rounded-full w-[48px] h-[48px]"
          />
          <div className="flex-col justify-center items-start gap-1 inline-flex">
            <Typography.Label className="text-opacity-30 -mb-1">
              {minifyPubky(contactId)}
            </Typography.Label>
            <Typography.Body variant="medium-bold">
              {contact.profile.name}
            </Typography.Body>
          </div>
        </Link>
        <div className="lg:flex justify-start items-center lg:w-full">
          <Typography.Body
            variant="small"
            className="lg:px-12 text-opacity-80 leading-[18px]"
          >
            {contact.profile.bio}
          </Typography.Body>
        </div>
        <div className="flex gap-4">
          {pubkeyUser ? (
            <Button.Medium
              className="w-[154px] bg-transparent cursor-default"
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
              className="w-[154px]"
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
              className="w-[154px]"
            >
              Follow
            </Button.Medium>
          )}
        </div>
      </div>
      {index !== contactsLength - 1 && <Content.Divider />}
    </div>
  );
}
