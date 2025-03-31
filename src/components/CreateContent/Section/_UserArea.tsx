'use client';

import { useRouter } from 'next/navigation';
import { Typography } from '@social/ui-shared';
import { useAlertContext, usePubkyClientContext } from '@/contexts';
import { Utils } from '@social/utils-shared';
import { ImageByUri } from '@/components/ImageByUri';

interface UserAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  largeView?: boolean;
  name: string;
  warningLink?: boolean;
  variant?: 'small';
}

export default function UserArea({ largeView, name, warningLink, variant }: UserAreaProps) {
  const router = useRouter();
  const { addAlert } = useAlertContext();
  const { pubky } = usePubkyClientContext();

  const handleProfileLink = () => {
    if (warningLink) {
      addAlert(
        <>
          Link disabled while creating content.{' '}
          <span onClick={() => router.push('/profile')} className="cursor-pointer font-bold hover:text-opacity-90">
            View profile
          </span>
        </>,
        'warning'
      );
    } else {
      router.push('/profile');
    }
  };

  return (
    <div onClick={handleProfileLink} className="justify-start gap-2 flex">
      <ImageByUri
        id={pubky}
        width={largeView ? 48 : 32}
        height={largeView ? 48 : 32}
        className={`${largeView ? 'w-[48px] h-[48px]' : 'w-[32px] h-[32px]'} rounded-full`}
        alt="user-image"
      />
      {!variant && (
        <>
          {pubky ? (
            <div className="cursor-pointer flex gap-4 items-center">
              <Typography.Body
                className={`${largeView && 'text-2xl'} hover:underline hover:decoration-solid`}
                variant="medium-bold"
              >
                {Utils.minifyText(name ?? Utils.minifyPubky(pubky), 24)}
              </Typography.Body>
              <div className="flex gap-1 cursor-pointer">
                {/**<Icon.CheckCircle size="16" color="gray" />*/}
                <Typography.Label className="text-opacity-30">{Utils.minifyPubky(pubky)}</Typography.Label>
              </div>
            </div>
          ) : (
            <Typography.Body variant="medium-bold" className="text-opacity-50">
              Loading...
            </Typography.Body>
          )}
        </>
      )}
    </div>
  );
}
