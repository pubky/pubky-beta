'use client';

type SwitchProps = {
  disable?: boolean;
};

import React from 'react';
export const Switch = ({ disable = false }: SwitchProps) => {
  const [checked, setChecked] = React.useState(false);

  const toggleSwitch = () => {
    if (!disable) {
      setChecked(!checked);
    }
  };

  const cursor = disable ? 'cursor-default' : 'cursor-pointer';
  const background = checked
    ? 'bg-fuchsia-500 bg-opacity-20 border border-fuchsia-500'
    : 'bg-white bg-opacity-10';

  const dot = checked && 'translate-x-6';
  const dotDisable = disable ? 'bg-white bg-opacity-30' : 'bg-white';

  return (
    <>
      <label
        className={`relative inline-flex ${cursor} select-none items-center`}
      >
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={toggleSwitch}
        />
        <span
          className={`flex h-8 w-[52px] items-center rounded-full p-1 duration-200 ${background}`}
        >
          <span
            className={`h-[18px] w-[18px] rounded-full duration-200 ${dotDisable} ${dot}`}
          />
        </span>
      </label>
    </>
  );
};
