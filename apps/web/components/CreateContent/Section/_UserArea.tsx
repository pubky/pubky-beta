'use client';

import { Icon, Typography } from '@social/ui-shared';
import { useClientContext } from '@/contexts';
import { Utils } from '@social/utils-shared';
import { useRouter } from 'next/navigation';
import { ImageByUri } from '@/components/ImageByUri';

interface UserAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  largeView: boolean;
  uriPic: string;
  name: string;
}

export default function UserArea({ largeView, uriPic, name }: UserAreaProps) {
  const { pubky } = useClientContext();
  const router = useRouter();

  return (
    <div className="justify-start items-center gap-3 flex">
      <ImageByUri
        width={largeView ? 48 : 32}
        height={largeView ? 48 : 32}
        className={`${
          largeView ? 'w-[48px] h-[48px]' : 'w-[32px] h-[32px]'
        } rounded-full`}
        alt="user-image"
        uri={uriPic}
      />
      {name && pubky ? (
        <div
          className="cursor-pointer flex gap-4 items-center"
          onClick={() => router.push('/profile')}
        >
          <Typography.Body
            className={`${
              largeView && 'text-2xl'
            } hover:underline hover:decoration-solid`}
            variant="medium-bold"
          >
            {Utils.minifyText(name, 24)}
          </Typography.Body>
          <div className="flex gap-1 cursor-pointer">
            <Icon.CheckCircle size="16" color="gray" />
            <Typography.Label className="text-opacity-30">
              {Utils.minifyPubky(pubky)}
            </Typography.Label>
          </div>
        </div>
      ) : (
        <Typography.Body variant="medium-bold" className="text-opacity-50">
          Loading...
        </Typography.Body>
      )}
    </div>
  );
}
