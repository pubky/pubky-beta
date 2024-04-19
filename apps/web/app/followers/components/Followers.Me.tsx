import { Content, Typography } from '@social/ui-shared';
import Image from 'next/image';
import Link from 'next/link';
import { minifyPubky } from '../../../libs/pubkyHelper';

interface MeProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  pubkey: string;
  image: string;
  followersCount?: number;
}

export default function Me({ name, pubkey, image, followersCount }: MeProps) {
  return (
    <Content.Grid className="py-8 sm:py-12 flex justify-between">
      <div className="gap-6 inline-flex">
        <Link href={`/profile/${pubkey}`}>
          <div className="gap-3 flex items-center">
            <Image
              width={32}
              height={32}
              className="w-[32px] h-[32px] rounded-full"
              src={image}
              alt="user-pic"
            />
            <Typography.H2 className="text-sm sm:text-2xl">
              {name}
            </Typography.H2>
            <Typography.Label className="hidden lg:block text-opacity-30 mt-1">
              {minifyPubky(pubkey)}
            </Typography.Label>
          </div>
        </Link>
      </div>
      <div className="gap-3 flex">
        <Typography.H2>{followersCount} followers</Typography.H2>
      </div>
    </Content.Grid>
  );
}
