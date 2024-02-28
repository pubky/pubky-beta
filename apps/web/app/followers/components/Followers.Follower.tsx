import Image from 'next/image';
import { Button, Content, Icon, Typography } from '@social/ui-shared';

export default function Follower() {
  return (
    <>
      <div className="justify-start items-center gap-4 inline-flex">
        <Image
          width={48}
          height={48}
          src="/images/user.png"
          alt="user-pic"
          className="rounded-full"
        />
        <div className="flex-col justify-center items-start gap-1 inline-flex">
          <Typography.Label className="text-opacity-30 -mb-1">
            @1Rx3...KO43
          </Typography.Label>
          <Typography.Body variant="medium-bold">Anna Pleb</Typography.Body>
        </div>
        <Typography.Body
          variant="small"
          className="px-12 text-opacity-80 leading-[18px]"
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque
          molestie nulla sit amet velit venenatis, ut blandit enim lacinia.
        </Typography.Body>
        <div className="flex-col justify-start items-start gap-1 inline-flex">
          <Typography.Label className="text-opacity-30 -mb-1">
            TAGS
          </Typography.Label>
          <Typography.Body variant="medium-bold">76</Typography.Body>
        </div>
        <div className="flex-col justify-start items-start gap-1 inline-flex">
          <Typography.Label className="text-opacity-30 -mb-1">
            POSTS
          </Typography.Label>
          <Typography.Body variant="medium-bold">12</Typography.Body>
        </div>
        <Button.Medium icon={<Icon.UserPlus size="16" />} className="w-[114px]">
          Follow
        </Button.Medium>
      </div>
      <Content.Divider />
    </>
  );
}
