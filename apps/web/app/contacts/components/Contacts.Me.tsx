import { Icon, Typography } from '@social/ui-shared';
import Image from 'next/image';
import Link from 'next/link';
import { DropDown } from '../../components/DropDown';
import { useClientContext } from '../../../contexts/client';
import { minifyPubky } from '../../../libs/pubkyHelper';

interface MeProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  pubkey: string;
  image: string;
  countContacts: number;
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
  const { pubky } = useClientContext();
  const profileLink = pubkey === pubky ? '/profile' : `/profile/${pubkey}`;

  return (
    <div className="pb-8 sm:pb-12 flex gap-12">
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
                {minifyPubky(pubkey)}
              </Typography.Label>
              <Typography.H2 className="text-sm sm:text-2xl">
                {name}
              </Typography.H2>
            </div>
          </div>
        </Link>
      </div>
      <div className="flex-col flex">
        <Typography.Label className="text-opacity-30">
          {contactsLayout === 'followers'
            ? 'followers'
            : contactsLayout === 'following'
            ? 'following'
            : 'friends'}
        </Typography.Label>
        <Typography.H2>
          {loadingContacts ? <Icon.LoadingSpin size="24" /> : countContacts}
        </Typography.H2>
      </div>
      <DropDown.SortFriends type="text" subtitle="Sort by" />
    </div>
  );
}
