import { Typography } from '@social/ui-shared';
import { UserView } from '@/types/User';

interface CountersProps {
  user: UserView | undefined;
  mobile?: boolean;
}

export function Counters({ user, mobile = false }: CountersProps) {
  if (mobile) {
    return (
      <div className="flex lg:hidden gap-4">
        <div className="inline-flex flex-col justify-start items-start gap-1">
          <Typography.Label className="text-[12px] text-opacity-30 -mb-1">
            Tags
          </Typography.Label>
          <Typography.Body variant="medium-bold">
            {user?.counts?.tags ?? 0}
          </Typography.Body>
        </div>
        <div className="inline-flex flex-col justify-start items-start gap-1">
          <Typography.Label className="text-[12px] text-opacity-30 -mb-1">
            Posts
          </Typography.Label>
          <Typography.Body variant="medium-bold">
            {user?.counts?.posts ?? 0}
          </Typography.Body>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="hidden lg:inline-flex flex-col justify-start items-start gap-1">
        <Typography.Label className="text-[12px] text-opacity-30 -mb-1">
          Tags
        </Typography.Label>
        <Typography.Body variant="medium-bold">
          {user?.counts?.tags ?? 0}
        </Typography.Body>
      </div>
      <div className="hidden lg:inline-flex flex-col justify-start items-start gap-1">
        <Typography.Label className="text-[12px] text-opacity-30 -mb-1">
          Posts
        </Typography.Label>
        <Typography.Body variant="medium-bold">
          {user?.counts?.posts ?? 0}
        </Typography.Body>
      </div>
    </>
  );
}
