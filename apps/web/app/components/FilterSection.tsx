'use client';

import { Button, Icon, Input } from '@social/ui-shared';
import { useState } from 'react';
import { Dropdown } from './Dropdown';

export const FilterSection = () => {
  const [selectedA, setSelectedA] = useState(true);
  const [selectedB, setSelectedB] = useState(false);
  return (
    <>
      <div className="justify-start items-center gap-6 inline-flex">
        <div className="justify-start items-center gap-3 flex">
          <Button.Action variant="all" active />
          <Button.Action variant="posts" />
          <Button.Action variant="image" />
          <Button.Action variant="video" />
          <Button.Action variant="link" />
        </div>
        <Dropdown
          label="Sort by"
          title="Sort"
          subtitle="Sort posts by"
          items={['Recent', 'Weight', 'Hotness', 'Discovery']}
        />
      </div>
      <div className="gap-4 inline-flex">
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
        <Dropdown
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
      </div>
    </>
  );
};
