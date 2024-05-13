import { Icon, Typography } from '@social/ui-shared';
import Image from 'next/image';
import Link from 'next/link';
import { DropDown } from '../../../components/DropDown';
import { useClientContext } from '../../../contexts/client';
import { Utils } from '../../../utils';
import { useEffect, useState } from 'react';

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
  contactsLayout: string;
  loadingContacts: boolean;
}

export default function Me({
  name,
  pubkey,
  image,
  countContacts,
  contactsLayout,
  loadingContacts,
}: MeProps) {
  const [pubkyText, setPubkyText] = useState('');
  const { pubky } = useClientContext();
  const profileLink = pubkey === pubky ? '/profile' : `/profile/${pubkey}`;

  useEffect(() => {
    setPubkyText(Utils.minifyPubky(pubkey));
  }, [pubkey]);

  return (
    <div className="pb-8 sm:pb-12 flex justify-between">
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
              <Typography.Label className="hidden lg:block text-opacity-30">
                {Utils.minifyPubky(pubkyText)}
              </Typography.Label>
              <Typography.H2 className="text-sm sm:text-2xl">
                {name}
              </Typography.H2>
            </div>
          </div>
        </Link>
      </div>
      <div className="flex gap-12">
        <DropDown.SortFriends type="text" subtitle="Sort by" />
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
      </div>
    </div>
  );
}
