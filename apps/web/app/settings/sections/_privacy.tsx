'use client';

import { Icon, Input, Typography } from '@social/ui-shared';

export default function PrivacySafety() {
  return (
    <div className="p-8 md:p-12 bg-white bg-opacity-10 rounded-lg flex-col justify-start items-start gap-12 inline-flex">
      <div className="w-full flex-col justify-start items-start gap-6 flex">
        <div className="justify-start items-center gap-2 inline-flex">
          <Icon.Shield size="24" />
          <Typography.H2>Privacy and Safety</Typography.H2>
        </div>
        <Typography.Body variant="medium" className="text-opacity-80">
          Privacy is not a crime. Manage your visibility and safety on Pubky.
        </Typography.Body>
        <div className="w-full p-6 bg-white bg-opacity-5 rounded-2xl flex-col justify-start items-start gap-6 inline-flex">
          <div className="w-full h-8 justify-between items-center inline-flex">
            <Typography.Body variant="small-bold">
              Sign me out when inactive for 5 minutes
            </Typography.Body>
            <Input.Switch disabled />
          </div>
          <div className="w-full h-8 justify-between items-center inline-flex">
            <Typography.Body variant="small-bold">
              Require PIN when inactive for 5 minutes
            </Typography.Body>
            <Input.Switch disabled />
          </div>
          <div className="w-full h-8 justify-between items-center inline-flex">
            <Typography.Body variant="small-bold">
              Hide your profile in &apos;Who to Follow&apos;
            </Typography.Body>
            <Input.Switch disabled />
          </div>
          <div className="w-full h-8 justify-between items-center inline-flex">
            <Typography.Body variant="small-bold">
              Hide your profile in &apos;Active Friends&apos;
            </Typography.Body>
            <Input.Switch disabled />
          </div>
          <div className="w-full h-8 justify-between items-center inline-flex">
            <Typography.Body variant="small-bold">
              Hide your profile in search results
            </Typography.Body>
            <Input.Switch disabled />
          </div>
          <div className="w-full h-8 justify-between items-center inline-flex">
            <Typography.Body variant="small-bold">
              Never show posts from people you don&apos;t follow
            </Typography.Body>
            <Input.Switch disabled />
          </div>
        </div>
      </div>
    </div>
  );
}
