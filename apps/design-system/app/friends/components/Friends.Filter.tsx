'use client';

import { useState } from 'react';
import { Input, Icon, Filter as FilterUI, DropDown } from '@social/ui-shared';

export default function Filter() {
  const [selectedA, setSelectedA] = useState(true);
  const [selectedB, setSelectedB] = useState(false);
  const [selectedC, setSelectedC] = useState(false);

  return (
    <FilterUI.Root>
      <FilterUI.Row>
        <DropDown.Root
          label="Sort by"
          title="Sort"
          subtitle="Sort your friend by"
          items={['Active this month', 'Active all time', 'Key']}
        />
      </FilterUI.Row>
      <FilterUI.SmallRow>
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
      </FilterUI.SmallRow>
    </FilterUI.Root>
  );
}
