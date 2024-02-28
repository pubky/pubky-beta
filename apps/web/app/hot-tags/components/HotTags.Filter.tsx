'use client';

import { useState } from 'react';
import { Input, Icon, Filter as FilterUI, DropDown } from '@social/ui-shared';

export default function Filter() {
  const [selectedA, setSelectedA] = useState(true);
  const [selectedB, setSelectedB] = useState(false);
  const [selectedC, setSelectedC] = useState(false);

  return (
    <FilterUI.Root>
      <div className="gap-6 inline-flex">
        <DropDown.Root
          label="Show"
          title="Sort"
          subtitle="Sort tags by"
          items={['This month', 'This week', 'Today']}
        />
      </div>
      <FilterUI.Select>
        <Input.Select
          size="small"
          text="All"
          icon={<Icon.Broadcast />}
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
