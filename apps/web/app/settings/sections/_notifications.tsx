import { Icon, Input, Typography } from '@social/ui-shared';

export default function Notifications() {
  return (
    <div className="p-12 bg-white bg-opacity-10 rounded-2xl flex-col justify-start items-start gap-12 inline-flex">
      <div className="w-full flex-col justify-start items-start gap-6 flex">
        <div className="justify-start items-center gap-2 inline-flex">
          <Icon.BellSimple size="24" />
          <Typography.H2>Platform notifications</Typography.H2>
        </div>
        <Typography.Body variant="medium" className="text-opacity-80">
          Please select which notifications you want to receive on Pubky.
        </Typography.Body>
        <div className="w-full p-6 bg-white bg-opacity-5 rounded-2xl shadow backdrop-blur-[50px] flex-col justify-start items-start gap-6 inline-flex">
          <div className="w-full h-8 justify-between items-center inline-flex">
            <Typography.Body variant="small-bold">
              Someone tagged your post
            </Typography.Body>
            <Input.Switch checked disabled />
          </div>
          <div className="w-full h-8 justify-between items-center inline-flex">
            <Typography.Body variant="small-bold">
              Someone tagged your profile
            </Typography.Body>
            <Input.Switch checked disabled />
          </div>
          <div className="w-full h-8 justify-between items-center inline-flex">
            <Typography.Body variant="small-bold">New follower</Typography.Body>
            <Input.Switch checked disabled />
          </div>
          <div className="w-full h-8 justify-between items-center inline-flex">
            <Typography.Body variant="small-bold">New friend</Typography.Body>
            <Input.Switch checked disabled />
          </div>
          <div className="w-full h-8 justify-between items-center inline-flex">
            <Typography.Body variant="small-bold">Lost friend</Typography.Body>
            <Input.Switch checked disabled />
          </div>
          <div className="w-full h-8 justify-between items-center inline-flex">
            <Typography.Body variant="small-bold">
              New reply to your post
            </Typography.Body>
            <Input.Switch checked disabled />
          </div>
          <div className="w-full h-8 justify-between items-center inline-flex">
            <Typography.Body variant="small-bold">
              New repost to your post
            </Typography.Body>
            <Input.Switch checked disabled />
          </div>
          <div className="w-full h-8 justify-between items-center inline-flex">
            <Typography.Body variant="small-bold">
              Someone mentioned your profile
            </Typography.Body>
            <Input.Switch disabled />
          </div>
          <div className="w-full h-8 justify-between items-center inline-flex">
            <Typography.Body variant="small-bold">
              Someone deleted a post you replied/repost
            </Typography.Body>
            <Input.Switch disabled />
          </div>
        </div>
      </div>
    </div>
  );
}
