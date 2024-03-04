import { Icon, Typography, Button, PostUtil } from '@social/ui-shared';
import Image from 'next/image';

export default function Notification() {
  return (
    <div className="p-3 border-t border-white border-opacity-10 justify-between items-start inline-flex">
      <div className="justify-start items-center gap-4 flex-col sm:flex-row sm:inline-flex">
        <div className="justify-start items-center gap-4 flex">
          <Button.Action
            size="small"
            variant="custom"
            icon={<Icon.Tag />}
            disabled
          />
          <Image
            width={32}
            height={32}
            className="rounded-full"
            alt="user-pic"
            src="/images/user.png"
          />
        </div>
        <div className="justify-start items-center gap-2 flex">
          <Typography.Body variant="medium-bold">John tagged</Typography.Body>
          <Typography.Body variant="medium-bold" className="text-opacity-50">
            {' '}
            post Let&apos;I have said it...Let&apos; as{' '}
          </Typography.Body>
          <PostUtil.Tag
            className="hidden sm:block"
            clicked={false}
            color="amber"
          >
            #Bitcoin
          </PostUtil.Tag>
        </div>
      </div>
      <div className="grow shrink basis-0 h-8 flex-col justify-center items-end gap-1 inline-flex">
        <Typography.Caption className="text-white text-opacity-50">
          1m
        </Typography.Caption>
      </div>
    </div>
  );
}
