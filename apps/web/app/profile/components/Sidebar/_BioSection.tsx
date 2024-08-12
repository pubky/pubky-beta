import { Typography, SideCard } from '@social/ui-shared';
import Parsing from '@/components/Content/_Parsing';
import { Skeleton } from '@/components';

export default function BioSection({
  bio,
  loading,
}: {
  bio: string;
  loading: boolean;
}) {
  return (
    <>
      {loading ? (
        <div className="w-full">
          <SideCard.Header title="Bio" />
          <Skeleton.Simple />
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-2">
            <SideCard.Header title="Bio" />
            <Typography.Body
              variant="medium"
              className="text-opacity-80 break-words max-h-[300px] overflow-y-auto"
            >
              <Parsing>{bio}</Parsing>
            </Typography.Body>
          </div>
        </>
      )}
    </>
  );
}
