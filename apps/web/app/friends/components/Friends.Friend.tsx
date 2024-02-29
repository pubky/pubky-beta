import { Content, Typography } from '@social/ui-shared';
import Image from 'next/image';
import { Post } from '../../components';

export default function Friend() {
  return (
    <>
      <div className="gap-6 inline-flex">
        <div className="w-full flex-col gap-6 inline-flex">
          <div className="gap-6 inline-flex">
            <Image
              width={201}
              height={201}
              className="rounded-full"
              src="/images/user.png"
              alt="user-pic"
            />
            <div className="flex-col gap-6 inline-flex">
              <div className="flex-col gap-1 flex">
                <Typography.Label className="text-opacity-50 leading-none">
                  Tags
                </Typography.Label>
                <Typography.H1 className="leading-[46px]">142</Typography.H1>
              </div>
              <div className="flex-col gap-1 flex">
                <Typography.Label className="text-opacity-50 leading-none">
                  Posts
                </Typography.Label>
                <Typography.H1 className="leading-[46px]">17</Typography.H1>
              </div>
            </div>
          </div>
          <div className="flex-col gap-1 flex">
            <Typography.H2>John Carvalho</Typography.H2>
            <Typography.Label className="text-opacity-50">
              @1Rx3...KO43
            </Typography.Label>
          </div>
        </div>
        <Post />
        <Post />
      </div>
      <Content.Divider className="my-12" />
    </>
  );
}
