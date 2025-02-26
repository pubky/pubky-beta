'use client';

import { useSearchParams } from 'next/navigation';
import { SideCard, Typography } from '@social/ui-shared';
import { useServerInfo } from '../../hooks/useServerInfo';
import { Skeleton } from '@/components';

const NEXT_PUBLIC_CONFCOLOUR = process.env.NEXT_PUBLIC_CONFCOLOUR;

export default function Version() {
  const { data, isLoading } = useServerInfo();
  const searchParams = useSearchParams();

  const devopsParam = searchParams.get('devops');
  const showBadge = devopsParam !== null ? true : false;

  const isBlue = NEXT_PUBLIC_CONFCOLOUR === 'blue';
  const environmentLabel = isBlue ? 'Blue' : 'Green';

  const badgeStyle = isBlue
    ? 'bg-blue-100 text-blue-600 border border-blue-200'
    : 'bg-green-100 text-green-600 border border-green-200';

  if (isLoading) {
    return (
      <div className="w-full flex-col justify-start items-start gap-2 inline-flex mt-6">
        <SideCard.Header title="Version" />
        <Skeleton.Simple />
      </div>
    );
  }

  return (
    <div className="w-full flex-col justify-start items-start gap-2 inline-flex mt-6">
      <SideCard.Header title="Version" />

      <div className="flex items-center gap-3">
        <Typography.Body variant="medium" className="text-opacity-80 leading-snug">
          Pubky v{data?.version} © Synonym Software Ltd
        </Typography.Body>
      </div>
      {showBadge && (
        <span
          title={`You are in the ${environmentLabel} environment`}
          className={`px-2 py-1 text-xs font-medium rounded-full cursor-default ${badgeStyle}`}
        >
          {environmentLabel}
        </span>
      )}
    </div>
  );
}
