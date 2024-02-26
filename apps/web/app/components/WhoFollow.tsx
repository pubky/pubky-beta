import Image from 'next/image';
import { Button, Card, Content, Icon, Typography } from '@social/ui-shared';

export const WhoFollow = () => {
  return (
    <div>
      <Typography.Body variant="large-bold">Who to follow</Typography.Body>
      <Card.Primary className="w-96 mt-4">
        <div className="justify-between items-center inline-flex">
          <div className="gap-4 inline-flex">
            <Image
              width={48}
              height={48}
              className="rounded-full"
              alt="user"
              src="/images/user.png"
            />
            <div className="flex-col justify-start items-start gap-1 inline-flex">
              <Typography.Caption className="text-white text-opacity-30 -mb-1">
                @1W78...gR31
              </Typography.Caption>
              <Typography.Body variant="medium-bold">Anna Pleb</Typography.Body>
            </div>
          </div>
          <Button.Medium
            icon={<Icon.UserPlus size="16" />}
            className="w-[114px]"
          >
            Follow
          </Button.Medium>
        </div>
        <Content.Divider className="my-2.5" />
        <div className="justify-between items-center inline-flex">
          <div className="gap-4 inline-flex">
            <Image
              width={48}
              height={48}
              className="rounded-full"
              alt="user"
              src="/images/user.png"
            />
            <div className="flex-col justify-start items-start gap-1 inline-flex">
              <Typography.Caption className="text-white text-opacity-30 -mb-1">
                @1W78...gR31
              </Typography.Caption>
              <Typography.Body variant="medium-bold">Anna Pleb</Typography.Body>
            </div>
          </div>
          <Button.Medium
            icon={<Icon.UserPlus size="16" />}
            className="w-[114px]"
          >
            Follow
          </Button.Medium>
        </div>
        <Content.Divider className="my-2.5" />
        <div className="justify-between items-center inline-flex">
          <div className="gap-4 inline-flex">
            <Image
              width={48}
              height={48}
              className="rounded-full"
              alt="user"
              src="/images/user.png"
            />
            <div className="flex-col justify-start items-start gap-1 inline-flex">
              <Typography.Caption className="text-white text-opacity-30 -mb-1">
                @1W78...gR31
              </Typography.Caption>
              <Typography.Body variant="medium-bold">Anna Pleb</Typography.Body>
            </div>
          </div>
          <Button.Medium
            icon={<Icon.UserPlus size="16" />}
            className="w-[114px]"
          >
            Follow
          </Button.Medium>
        </div>
      </Card.Primary>
    </div>
  );
};
