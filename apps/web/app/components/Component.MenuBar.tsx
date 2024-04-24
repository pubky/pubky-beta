import {
  Button,
  Icon,
  PostUtil,
  SideCard,
  Typography,
} from '@social/ui-shared';
import Link from 'next/link';

export default function MenuBar() {
  return (
    <div className="flex-col justify-start items-start gap-12 hidden xl:inline-flex w-full">
      <Icon.Pubky />
      <div className="flex-col justify-start items-start gap-2 hidden xl:inline-flex w-full">
        <Link
          href=""
          className="w-full py-2.5 shadow justify-between inline-flex cursor-pointer hover:bg-white hover:bg-opacity-10"
        >
          <div className="items-center gap-6 flex">
            <Icon.Activity size="32" />
            <Typography.Body variant="large">Streams</Typography.Body>
          </div>
        </Link>
        <Link
          href=""
          className="w-full py-2.5 shadow justify-between inline-flex cursor-pointer hover:bg-white hover:bg-opacity-10"
        >
          <div className="items-center gap-6 flex">
            <Icon.Bell size="32" />
            <Typography.Body variant="large">Notifications</Typography.Body>
          </div>
          <div>
            <PostUtil.Counter
              className="border-fuchsia-500 border-opacity-100"
              counter={5}
            />
          </div>
        </Link>
        <Link
          href=""
          className="w-full py-2.5 shadow justify-between inline-flex cursor-pointer hover:bg-white hover:bg-opacity-10"
        >
          <div className="items-center gap-6 flex">
            <Icon.Tag size="32" />
            <Typography.Body variant="large">Hot Tags</Typography.Body>
          </div>
        </Link>
        <Link
          href=""
          className="w-full py-2.5 shadow justify-between inline-flex cursor-pointer hover:bg-white hover:bg-opacity-10"
        >
          <div className="items-center gap-6 flex">
            <Icon.GearSix size="32" />
            <Typography.Body variant="large">Settings</Typography.Body>
          </div>
        </Link>
        <Link
          href=""
          className="w-full py-2.5 shadow justify-between inline-flex cursor-pointer hover:bg-white hover:bg-opacity-10"
        >
          <div className="items-center gap-6 flex">
            <Icon.UserRectangle size="32" />
            <Typography.Body variant="large">Profile</Typography.Body>
          </div>
        </Link>
        <Link
          href=""
          className="w-full py-2.5 shadow justify-between inline-flex cursor-pointer hover:bg-white hover:bg-opacity-10"
        >
          <div className="items-center gap-6 flex">
            <Icon.UserMinus size="32" />
            <Typography.Body variant="large">Logout</Typography.Body>
          </div>
        </Link>
        <Button.Large>Post</Button.Large>
      </div>
      <SideCard.User
        uri={'bgbf...bghf'}
        src={'/images/Userpic.png'}
        username={'flavio'}
        label={'gbfhf...gbgh'}
      />
    </div>
  );
}
