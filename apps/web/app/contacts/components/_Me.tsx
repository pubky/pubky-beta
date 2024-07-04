import { Icon, Typography } from '@social/ui-shared';
import Image from 'next/image';
import Link from 'next/link';
import { useClientContext } from '../../../contexts/client';
import { Utils } from '@social/utils-shared';

interface CountContacts {
  followers: number;
  following: number;
  friends: number;
}

interface MeProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  pubkey: string;
  image: string;
  countContacts: CountContacts;
  loadingContacts: boolean;
}

export default function Me({
  name,
  pubkey,
  image,
  countContacts,
  loadingContacts,
}: MeProps) {
  const { pubky } = useClientContext();
  const profileLink = pubkey === pubky ? '/profile' : `/profile/${pubkey}`;

  return (
    <div className="pb-8 sm:pb-12 lg:flex justify-start">
      <div className="gap-6 inline-flex">
        <Link href={profileLink}>
          <div className="gap-3 flex items-center">
            <Image
              width={48}
              height={48}
              className="w-[48px] h-[48px] rounded-full"
              src={image}
              alt="user-pic"
            />
            <div className="flex-col inline-flex">
              <Typography.H2 className="text-sm sm:text-2xl">
                {Utils.minifyText(name, 24)}
              </Typography.H2>
              <Typography.Label className="text-opacity-30">
                {Utils.minifyPubky(pubkey)}
              </Typography.Label>
            </div>
          </div>
        </Link>
      </div>
      <div className="mt-6 lg:mt-0 ml-12 flex gap-12">
        <div className="flex-col flex">
          <Typography.Label className="text-opacity-30">
            Following
          </Typography.Label>
          <Typography.H2>
            {loadingContacts ? (
              <Icon.LoadingSpin size="24" />
            ) : (
              countContacts.following
            )}
          </Typography.H2>
        </div>
        <div className="flex-col flex">
          <Typography.Label className="text-opacity-30">
            Followers
          </Typography.Label>
          <Typography.H2>
            {loadingContacts ? (
              <Icon.LoadingSpin size="24" />
            ) : (
              countContacts.followers
            )}
          </Typography.H2>
        </div>
        <div className="flex-col flex">
          <Typography.Label className="text-opacity-30">
            Friends
          </Typography.Label>
          <Typography.H2>
            {loadingContacts ? (
              <Icon.LoadingSpin size="24" />
            ) : (
              countContacts.friends
            )}
          </Typography.H2>
        </div>
        {/**<div className="hidden lg:block lg:-mt-1">
          <DropDown.SortFriends disabled type="text" subtitle="Sort by" />
        </div>*/}
      </div>
    </div>
  );
}
