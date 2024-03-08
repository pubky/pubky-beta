'use client';

import { useState } from 'react';
import { Input, Icon, Button, Filter as FilterUI } from '@social/ui-shared';
import DropDownSort from './Search.DropDownSort';
import DropDownMode from './Search.DropDownMode';

export default function Filter() {
  const [selectedA, setSelectedA] = useState(true);
  const [selectedB, setSelectedB] = useState(false);
  const [selectedC, setSelectedC] = useState(false);

  return (
    <FilterUI.Root>
      <FilterUI.Row>
        <FilterUI.SmallRow className="hidden lg:flex">
          <Button.Action variant="all" active />
          <Button.Action variant="posts" />
          <Button.Action variant="image" />
          <Button.Action variant="video" />
          <Button.Action variant="link" />
        </FilterUI.SmallRow>
        <DropDownSort />
      </FilterUI.Row>
      <FilterUI.Row>
        <FilterUI.SmallRow>
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
        </FilterUI.SmallRow>
        <DropDownMode />
      </FilterUI.Row>
    </FilterUI.Root>
  );
}
