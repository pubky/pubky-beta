import { Button, Card, Icon, Post, Typography } from '@social/ui-shared';
import Image from 'next/image';
import { Userpics } from './Userpics';

export const PostsSection = () => {
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
  const renderPosts = () => {
    const postItems = Array.from({ length: 5 }).map((_, index) => (
      <Card.Primary
        key={index}
        background="bg-white bg-opacity-10"
        className="bg-white bg-opacity-10 w-[792px] z-auto border-0"
      >
        <div className="pb-6 justify-start items-start inline-flex">
          <div className="justify-start items-center gap-4 flex">
            <Image
              width={32}
              height={32}
              className="rounded-full"
              alt="user"
              src="/images/user.png"
            />
            <Typography.Body variant="medium-bold">
              Satoshi Nakamoto
            </Typography.Body>
          </div>
          <div className="grow justify-end items-center gap-1 flex mt-2">
            <Icon.Clock size="16" color="gray" />
            <Typography.Caption
              variant="bold"
              className="text-white text-opacity-30"
            >
              27m
            </Typography.Caption>
          </div>
        </div>
        <div>
          <Typography.Body variant="medium" color="text-opacity-80">
            You either want lots of people using Bitcoin (holding Bitcoin keys)
            or you dont. Many of you seem to believe things that require both
            positions.
          </Typography.Body>
          <div className="justify-start items-start gap-2 flex mt-6">
            <Post.Tag clicked color="amber">
              #Bitcoin
            </Post.Tag>
            <Button.Action variant="custom" size="small" icon={<Icon.Plus />} />
            <Post.Counter counter={16} />
            <Userpics images={images} />
          </div>
          <div className="justify-start items-start gap-2 flex mt-6">
            <Button.Action
              size="small"
              variant="custom"
              icon={<Icon.Tag size="16" />}
              counter={3}
            />
            <Button.Action
              size="small"
              variant="custom"
              icon={<Icon.ChatCircleText size="16" />}
              counter={2}
            />
            <Button.Action
              size="small"
              variant="custom"
              icon={<Icon.Repost size="16" />}
              counter={7}
            />
            <Button.Action
              size="small"
              variant="custom"
              icon={<Icon.BookmarkSimple size="16" />}
            />
          </div>
        </div>
      </Card.Primary>
    ));
    return postItems;
  };

  return <div className="grid gap-6">{renderPosts()}</div>;
};
