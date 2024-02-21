'use client';

import React, { useEffect, useRef, useState } from 'react';
import { DropdownIcon } from '../Icon/Icon.Arrow';
import { Typography } from '../Typography';
import { Icon } from '../Icon';
import { Button } from '../Button';
import { Card } from '../Card';
import { twMerge } from 'tailwind-merge';

type Item = {
  icon: React.ReactNode;
  option: string;
};

interface DropdownProps extends React.HTMLAttributes<HTMLDivElement> {
  items: string[] | Item[];
  label?: string;
  title?: string;
  subtitle?: string;
  alignment?: 'right' | 'left';
}

export const Dropdown = ({
  items,
  label,
  title,
  subtitle,
  alignment = 'left',
  ...rest
}: DropdownProps) => {
  const [selectedItem, setSelectedItem] = useState<string | Item>(
    typeof items[0] === 'string' ? items[0] : (items[0] as Item)
  );
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelectItem = (item: string | Item) => {
    setSelectedItem(item);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const alignmentCard = alignment === 'right' && 'right-0';

  const arrowStyle = `ml-1 ${
    label ? 'mt-1' : 'mt-0.5'
  } transition ease duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`;

  const styleSelect = `bg-transparent text-white outline-none appearance-none font-['Inter Tight'] tracking-wide ${
    label
      ? 'text-2xl font-normal'
      : 'text-opacity-50 text-[13px] font-semibold uppercase'
  }`;

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {label && (
        <Typography.Label className="text-white text-opacity-30">
          {label}
        </Typography.Label>
      )}
      <div className="relative">
        <div className="rounded-md overflow-hidden">
          <div
            className={`${styleSelect} w-full flex items-center justify-between cursor-pointer`}
            onClick={toggleDropdown}
          >
            {typeof items[0] === 'string' ? (
              <>
                {selectedItem || 'Select'}
                <div className={arrowStyle}>
                  <DropdownIcon color={label ? 'white' : 'gray'} />
                </div>
              </>
            ) : (
              <Button.Action
                variant="custom"
                icon={
                  typeof selectedItem !== 'string' &&
                  selectedItem &&
                  selectedItem.icon
                }
              />
            )}
          </div>

          {isOpen && (
            <Card.Primary
              {...rest}
              className={twMerge(
                `${alignmentCard} w-[336px] mt-4 absolute z-10 p-12 bg-gradient-to-b from-stone-950 to-black rounded-2xl shadow border border-fuchsia-600 border-opacity-30 flex-col justify-start items-start gap-12 inline-flex`,
                rest.className
              )}
            >
              {title && subtitle && (
                <div className="mb-6 flex-col justify-start items-start flex">
                  <Typography.H1>{title}</Typography.H1>
                  <Typography.Body
                    variant="medium"
                    color="text-white text-opacity-80"
                  >
                    {subtitle}
                  </Typography.Body>
                </div>
              )}
              {items.map((item, index) => (
                <button
                  key={index}
                  className={`w-60 h-12 py-2 shadow border-b border-white border-opacity-10 backdrop-blur-[10px] items-center inline-flex ${
                    typeof item === 'string'
                      ? 'justify-between'
                      : 'justify-start'
                  }`}
                  onClick={() =>
                    handleSelectItem(
                      typeof item === 'string'
                        ? item
                        : { icon: item.icon, option: item.option }
                    )
                  }
                >
                  <div className="w-14 justify-start items-center contents">
                    {typeof item !== 'string' && (
                      <div className="mr-2">{item.icon}</div>
                    )}
                    <Typography.Body variant="medium-bold">
                      {typeof item === 'string' ? item : item.option}
                    </Typography.Body>
                    {selectedItem ===
                      (typeof item === 'string' ? item : item.option) && (
                      <div>
                        {typeof item === 'string' && <Icon.Check size="32" />}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </Card.Primary>
          )}
        </div>
      </div>
    </div>
  );
};
