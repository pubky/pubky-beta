'use client';

import { SideCard, Typography } from '@social/ui-shared';
import { useServerInfo } from '../../hooks/useServerInfo';
import { Skeleton } from '@/components';

export default function Version() {
  const { data, isLoading } = useServerInfo();

  return (
    <div className="w-full flex-col justify-start items-start gap-2 inline-flex mt-6">
      <SideCard.Header title="Version" />
      {isLoading ? (
        <Skeleton.Simple />
      ) : (
        <Typography.Body
          variant="medium"
          className="text-opacity-80 leading-snug"
        >
          Pubky v{data?.version} © Synonym Software Ltd
        </Typography.Body>
      )}
    </div>
  );
}
