'use client';

import React, { useState } from 'react';
import { DropdownIcon } from '../Icon/Icon.Arrow';
import { Typography } from '../Typography';

type DropdownProps = {
  items: string[];
  label?: string;
  text?: string;
};

export const Dropdown = ({ items, label, text }: DropdownProps) => {
  const [selectedItem, setSelectedItem] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectItem = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedItem(event.target.value);
  };

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const arrowStyle = `absolute top-1/2 left-52 translate-y-[-50%] transition ease duration-300 ${
    isOpen ? 'rotate-180' : 'rotate-0'
  }`;
  const styleSelect = `bg-black text-white outline-none appearance-none text-2xl font-normal font-['Inter Tight'] tracking-wide`;

  return (
    <>
      <Typography.Label color="text-white text-opacity-30">
        {label}
      </Typography.Label>
      <div className="relative inline-flex mr-3">
        <Typography.Body>{text}</Typography.Body>
        <span className={arrowStyle}>
          <DropdownIcon />
        </span>
      </div>
      <select
        id="dropdown"
        className={styleSelect}
        value={selectedItem}
        onChange={handleSelectItem}
        onClick={handleToggleDropdown}
      >
        {items.map((item, index) => (
          <option key={index} value={item}>
            {item}
          </option>
        ))}
      </select>
    </>
  );
};
