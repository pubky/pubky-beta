'use client';

import { Icon, SideCard, Typography } from '@social/ui-shared';

export default function ProfileSidebar() {
  return (
    <div>
      <SideCard.Header title="profile" variantTitle="label" />
      <SideCard.Content className="flex-col gap-3 inline-flex">
        <>
          <div className="flex w-full justify-center">
            <Icon.LoadingSpin className="animate-spin text-4xl text-center mx-auto" />
          </div>
          <Typography.Body
            variant="medium-bold"
            className="col-span-3 -m-2 flex justify-center items-center gap-6 text-gray-600"
          >
            Loading Profile
          </Typography.Body>
        </>
      </SideCard.Content>
    </div>
  );
}
