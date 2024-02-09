'use client';

import React, { useState, CSSProperties } from 'react';
import { DropdownIcon } from '../Icon/Icon.Arrow';

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

  const arrowStyle: CSSProperties = {
    position: 'absolute',
    top: '50%',
    right: '-95px',
    transform: `translateY(-50%) rotate(${isOpen ? '180deg' : '0deg'})`,
    transition: `transform 0.3s ease`,
  };

  const styleSelect: CSSProperties = {
    background: 'black',
    color: 'white',
    outline: 'none',
    fontSize: '24px',
    fontWeight: 300,
    lineHeight: '30px',
    letterSpacing: '0.1px',
    appearance: 'none',
    paddingRight: '30px',
  };

  const labelStyle: CSSProperties = {
    fontSize: '13px',
    fontWeight: 600,
    lineHeight: '16px',
    letterSpacing: '1px',
    color: '#FFFFFF52',
    textTransform: 'uppercase',
  };

  return (
    <div>
      <div>
        <span style={labelStyle}>{label}</span>
      </div>
      <label
        htmlFor="dropdown"
        className="relative text-white font-light text-[24px] leading-[30px] tracking-[0.6px]"
      >
        {text}{' '}
        <span onClick={handleToggleDropdown} style={arrowStyle}>
          <DropdownIcon />
        </span>
      </label>
      <select
        id="dropdown"
        style={styleSelect}
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
    </div>
  );
};
