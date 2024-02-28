'use client';

import { useState } from 'react';
import { Input, Icon, Filter as FilterUI, Typography } from '@social/ui-shared';
import Image from 'next/image';

export default function Filter() {
  const [selectedA, setSelectedA] = useState(false);
  const [selectedB, setSelectedB] = useState(false);
  const [selectedC, setSelectedC] = useState(true);

  return (
    <FilterUI.Root>
      <div className="gap-6 inline-flex">
        <div className="justify-start items-center gap-3 inline-flex">
          <Image
            width={32}
            height={32}
            className="rounded-full"
            src="/images/user.png"
            alt="user-pic"
          />
          <Typography.H2> John Carvalho</Typography.H2>
          <Typography.Label className="text-opacity-30 mt-1">
            @1Rx3...KO43
          </Typography.Label>
        </div>
      </div>
      <FilterUI.Select>
        <Input.Select
          size="small"
          text="Followers"
          icon={<Icon.Users />}
          active={selectedC}
          onClick={(active: boolean) => {
            setSelectedC(active);
          }}
        />
        <Input.Select
          size="small"
          text="Following"
          icon={<Icon.UserPlus />}
          active={selectedA}
          onClick={(active: boolean) => {
            setSelectedA(active);
          }}
        />
        <Input.Select
          size="small"
          text="Friends"
          icon={<Icon.Smiley />}
          active={selectedB}
          onClick={(active: boolean) => {
            setSelectedB(active);
          }}
        />
      </FilterUI.Select>
    </FilterUI.Root>
  );
}
