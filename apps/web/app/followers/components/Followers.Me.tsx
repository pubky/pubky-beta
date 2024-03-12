import { Content, Typography } from '@social/ui-shared';
import Image from 'next/image';

export default function Me() {
  return (
    <Content.Grid className="py-8 sm:py-12 flex justify-between">
      <div className="gap-6 inline-flex">
        <div className="gap-3 flex items-center">
          <Image
            width={32}
            height={32}
            className="rounded-full"
            src="/images/user.png"
            alt="user-pic"
          />
          <Typography.H2 className="text-sm sm:text-2xl">
            John Carvalho
          </Typography.H2>
          <Typography.Label className="hidden lg:block text-opacity-30 mt-1">
            @1Rx3...KO43
          </Typography.Label>
        </div>
      </div>
      <div className="gap-3 flex">
        <Typography.H2>517 followers</Typography.H2>
      </div>
    </Content.Grid>
  );
}
