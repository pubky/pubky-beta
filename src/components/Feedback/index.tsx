'use client';

import { SideCard, Typography } from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import { ImageByUri } from '../ImageByUri';
import { useModal, usePubkyClientContext } from '@/contexts';
import Link from 'next/link';

export default function Feedback() {
  const { pubky, profile } = usePubkyClientContext();
  const { openModal } = useModal();

  if (!pubky) return;

  return (
    <div className="col-span-1">
      <SideCard.Header title="Feedback" />
      <SideCard.Content className="mt-3">
        <div className="p-5 w-full rounded-lg border-dashed border border-white border-opacity-30 flex-col justify-start items-start inline-flex">
          <div className="flex flex-col gap-3">
            <Link href="/profile" className="flex gap-1 items-center">
              <ImageByUri id={pubky} alt="user" width={32} height={32} className="rounded-full w-8 h-8" />
              <Typography.Body
                variant="medium-bold"
                className="whitespace-nowrap hover:underline hover:decoration-solid"
              >
                {Utils.minifyText(profile?.name ?? Utils.minifyPubky(pubky ?? ''), 6)}
              </Typography.Body>
            </Link>
            <div className="cursor-pointer" onClick={() => openModal('feedback')}>
              <Typography.Body className="text-opacity-30 leading-snug tracking-wide" variant="medium">
                What do you think about Pubky?
              </Typography.Body>
            </div>
          </div>
        </div>
      </SideCard.Content>
    </div>
  );
}
