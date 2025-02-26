import { Typography, SideCard } from '@social/ui-shared';
import Parsing from '@/components/Content/_Parsing';
import { Skeleton } from '@/components';

export default function BioSection({ id, bio, loading }: { id: string; bio: string; loading: boolean }) {
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
            <Typography.Body id={id} variant="medium" className="text-opacity-80 break-words">
              <Parsing>{bio}</Parsing>
            </Typography.Body>
          </div>
        </>
      )}
    </>
  );
}
