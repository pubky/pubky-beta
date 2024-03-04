'use client';

import {
  Icon,
  PostUtil,
  Button,
  Typography,
  Post,
  SideCard,
} from '@social/ui-shared';
import Image from 'next/image';
import Link from 'next/link';

export default function Sidebar() {
  const images = [
    {
      src: '/images/user.png',
      alt: '1',
    },
    {
      src: '/images/user.png',
      alt: '2',
    },
    {
      src: '/images/user.png',
      alt: '3',
    },
    {
      src: '/images/user.png',
      alt: '4',
    },
    {
      src: '/images/user.png',
      alt: '5',
    },
  ];

  return (
    <div className="hidden flex-col justify-start items-start gap-6 xl:inline-flex">
      <div>
        <SideCard.Header title="profile" variantTitle="label" />
        <SideCard.Content className="flex-col gap-3 inline-flex">
          <div className="justify-start items-center gap-3 inline-flex">
            <Image
              width={32}
              height={32}
              className="rounded-full"
              src="/images/user.png"
              alt="user-pic"
            />
            <Typography.H2>Satoshi Nakamoto</Typography.H2>
          </div>
          <Typography.Label className="text-opacity-50">
            @1qx7...gkw3
          </Typography.Label>
          <Typography.Body variant="medium" className="text-opacity-80">
            {' '}
            Authored the Bitcoin white paper, developed Bitcoin, mined first
            block.
          </Typography.Body>
        </SideCard.Content>
      </div>
      <div>
        <SideCard.Header title="Tagged as" variantTitle="label" />
        <SideCard.Content>
          <div className="flex-col gap-3 inline-flex">
            <Post.Footer className="mt-0">
              <PostUtil.Tag clicked color="amber">
                #Bitcoin
              </PostUtil.Tag>
              <Button.Action
                variant="custom"
                size="small"
                icon={<Icon.Plus />}
              />
              <PostUtil.Counter counter={16} />
              <Post.UserPic images={images} />
            </Post.Footer>
          </div>
        </SideCard.Content>
      </div>
      <div>
        <SideCard.Header title="Contacts" variantTitle="label" />
        <SideCard.Content>
          <div className="flex-col gap-3 inline-flex">
            <div className="inline-flex gap-2">
              <Typography.Label>1425</Typography.Label>
              <Typography.Label className="text-opacity-50">
                Followers
              </Typography.Label>
            </div>
            <Post.UserPic images={images} />
          </div>
        </SideCard.Content>
      </div>
      <div>
        <SideCard.Header title="Links" variantTitle="label" />
        <div className="gap-4 inline-flex">
          <Link href="https://x.com/">
            <SideCard.Content className="w-[120px] h-24 justify-center items-center">
              <Icon.Twitter />
            </SideCard.Content>
          </Link>
          <Link href="https://youtube.com/">
            <SideCard.Content className="w-[120px] h-24 justify-center items-center">
              <Icon.Youtube />
            </SideCard.Content>
          </Link>
          <Link href="https://telegram.com/">
            <SideCard.Content className="w-[120px] h-24 justify-center items-center">
              <Icon.Telegram />
            </SideCard.Content>
          </Link>
        </div>
      </div>
    </div>
  );
}
