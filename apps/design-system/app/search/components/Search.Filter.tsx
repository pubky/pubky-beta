'use client';

import { useState } from 'react';
import {
  Input,
  Icon,
  Button,
  Filter as FilterUI,
  DropDown,
} from '@social/ui-shared';

export default function Filter() {
  const [selectedA, setSelectedA] = useState(true);
  const [selectedB, setSelectedB] = useState(false);
  const [selectedC, setSelectedC] = useState(false);

  return (
    <FilterUI.Root>
      <FilterUI.Row>
        <FilterUI.SmallRow>
          <Button.Action variant="all" active />
          <Button.Action variant="posts" />
          <Button.Action variant="image" />
          <Button.Action variant="video" />
          <Button.Action variant="link" />
        </FilterUI.SmallRow>
        <DropDown.Root
          label="Sort by"
          title="Sort"
          subtitle="Sort posts by"
          items={['Recent', 'Weight', 'Hotness', 'Discovery']}
        />
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
        <DropDown.Root
          title="Mode"
          subtitle="Switch to a different view "
          items={[
            {
              icon: <Icon.SquareHalf />,
              option: 'Sidebar',
            },
            {
              icon: <Icon.List />,
              option: 'List',
            },
            {
              icon: <Icon.DotsNine />,
              option: 'Grid',
            },
            {
              icon: <Icon.SquaresFour />,
              option: 'Columns',
            },
          ]}
          alignment="right"
        />
      </FilterUI.Row>
    </FilterUI.Root>
  );
}
