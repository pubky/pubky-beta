import Image from 'next/image';
import { Button, Card, Content, Icon, Typography } from '@social/ui-shared';

export const ActiveFriends = () => {
  return (
    <div>
      <Typography.Body variant="large-bold">Active friends</Typography.Body>
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
              <Typography.Caption
                variant="bold"
                className="text-white text-opacity-30 -mb-1"
              >
                FRIEND
              </Typography.Caption>
              <Typography.Body variant="medium-bold">Anna Pleb</Typography.Body>
            </div>
          </div>
          <div className="inline-flex gap-4">
            <div className="flex-col justify-start items-start gap-1 inline-flex">
              <Typography.Caption
                variant="bold"
                className="text-white text-opacity-30 -mb-1"
              >
                TAGS
              </Typography.Caption>
              <Typography.Body variant="medium-bold">142</Typography.Body>
            </div>
            <div className="flex-col justify-start items-start gap-1 inline-flex">
              <Typography.Caption
                variant="bold"
                className="text-white text-opacity-30 -mb-1"
              >
                POSTS
              </Typography.Caption>
              <Typography.Body variant="medium-bold">17</Typography.Body>
            </div>
          </div>
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
              <Typography.Caption
                variant="bold"
                className="text-white text-opacity-30 -mb-1"
              >
                FRIEND
              </Typography.Caption>
              <Typography.Body variant="medium-bold">Anna Pleb</Typography.Body>
            </div>
          </div>
          <div className="inline-flex gap-4">
            <div className="flex-col justify-start items-start gap-1 inline-flex">
              <Typography.Caption
                variant="bold"
                className="text-white text-opacity-30 -mb-1"
              >
                TAGS
              </Typography.Caption>
              <Typography.Body variant="medium-bold">142</Typography.Body>
            </div>
            <div className="flex-col justify-start items-start gap-1 inline-flex">
              <Typography.Caption
                variant="bold"
                className="text-white text-opacity-30 -mb-1"
              >
                POSTS
              </Typography.Caption>
              <Typography.Body variant="medium-bold">17</Typography.Body>
            </div>
          </div>
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
              <Typography.Caption
                variant="bold"
                className="text-white text-opacity-30 -mb-1"
              >
                FRIEND
              </Typography.Caption>
              <Typography.Body variant="medium-bold">Anna Pleb</Typography.Body>
            </div>
          </div>
          <div className="inline-flex gap-4">
            <div className="flex-col justify-start items-start gap-1 inline-flex">
              <Typography.Caption
                variant="bold"
                className="text-white text-opacity-30 -mb-1"
              >
                TAGS
              </Typography.Caption>
              <Typography.Body variant="medium-bold">142</Typography.Body>
            </div>
            <div className="flex-col justify-start items-start gap-1 inline-flex">
              <Typography.Caption
                variant="bold"
                className="text-white text-opacity-30 -mb-1"
              >
                POSTS
              </Typography.Caption>
              <Typography.Body variant="medium-bold">17</Typography.Body>
            </div>
          </div>
        </div>
        <Button.Medium icon={<Icon.Users size="16" />} className="mt-6">
          See All
        </Button.Medium>
      </Card.Primary>
    </div>
  );
};
