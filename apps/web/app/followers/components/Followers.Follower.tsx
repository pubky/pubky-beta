import Image from 'next/image';
import { Button, Content, Icon, Typography } from '@social/ui-shared';
import { minifyPubky } from '../../../libs/pubkyHelper';
import Link from 'next/link';

interface FollowersProps extends React.HTMLAttributes<HTMLDivElement> {
  followers?: Array<{
    profile: {
      name: string;
      image: string;
      bio: string;
    };
    uri: string;
  }>;
}

export default function Follower({ followers }: FollowersProps) {
  return (
    <>
      {followers &&
        followers.map((follower, index) => (
          <div key={index} className="w-full">
            <div className="flex-col lg:flex-row justify-between gap-4 inline-flex w-full">
              <Link href={`/profile/${follower.uri.replace('pubky:', '')}`}>
                <Image
                  width={48}
                  height={48}
                  src={follower.profile.image}
                  alt={`follower-pic-${index + 1}`}
                  className="rounded-full"
                />
              </Link>
              <Link
                href={`/profile/${follower.uri.replace('pubky:', '')}`}
                className="flex-col justify-center items-start gap-1 inline-flex"
              >
                <Typography.Label className="text-opacity-30 -mb-1">
                  {minifyPubky(follower.uri.replace('pubky:', ''))}
                </Typography.Label>
                <Typography.Body variant="medium-bold">
                  {follower.profile.name}
                </Typography.Body>
              </Link>
              <div className="lg:flex justify-center items-center">
                <Typography.Body
                  variant="small"
                  className="lg:px-12 text-opacity-80 leading-[18px]"
                >
                  {follower.profile.bio}
                </Typography.Body>
              </div>
              <div className="flex-col justify-start items-start gap-1 inline-flex">
                <Typography.Label className="uppercase text-opacity-30 -mb-1">
                  Tags
                </Typography.Label>
                <Typography.Body variant="medium-bold">76</Typography.Body>
              </div>
              <div className="flex-col justify-start items-start gap-1 inline-flex">
                <Typography.Label className="uppercase text-opacity-30 -mb-1">
                  Posts
                </Typography.Label>
                <Typography.Body variant="medium-bold">12</Typography.Body>
              </div>
              <Button.Medium
                icon={<Icon.UserPlus size="16" />}
                className="lg:ml-6 w-[114px]"
              >
                Follow
              </Button.Medium>
            </div>
            {index !== followers.length - 1 && <Content.Divider />}
          </div>
        ))}
    </>
  );
}
