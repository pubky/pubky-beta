'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Typography } from '../Typography';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { Card } from '../Card';
import { twMerge } from 'tailwind-merge';

type Item = {
  icon: React.ReactNode;
  option: string;
};

type DropdownProps = {
  items: string[] | Item[];
  label?: string;
  title?: string;
  subtitle?: string;
  width?: string;
  alignment?: 'right' | 'left';
  className?: string;
};

export const Root = ({
  items,
  label,
  title,
  subtitle,
  width = 'w-[336px]',
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

  const arrowStyle = `ml-1 ${
    label ? 'mt-1' : 'mt-0.5'
  } transition ease duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`;

  const styleSelect = `bg-transparent text-white outline-none appearance-none font-['Inter Tight'] tracking-wide ${
    label
      ? 'text-sm sm:text-2xl font-normal'
      : 'text-opacity-50 text-[13px] font-semibold uppercase'
  }`;

  return (
    <div
      {...rest}
      className={twMerge('relative inline-block', rest.className)}
      ref={dropdownRef}
    >
      <div>
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
                    <Icon.DropdownIcon color={label ? 'white' : 'gray'} />
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
                className={`${width} ${
                  alignment === 'right' && 'right-0'
                } bg-gradient-to-t from-[#07040a] to-[#1b1820] mt-4 absolute z-10 p-12 opacity-100 border border-fuchsia-600 border-opacity-30`}
              >
                {(title || subtitle) && (
                  <div className="mb-6 flex-col justify-start items-start flex">
                    {title && <Typography.H1>{title}</Typography.H1>}
                    {subtitle && (
                      <Typography.Body
                        variant="medium"
                        className="text-opacity-80"
                      >
                        {subtitle}
                      </Typography.Body>
                    )}
                  </div>
                )}
                {items.map((item, index) => (
                  <button
                    key={index}
                    className={`w-60 h-12 py-2 shadow border-b border-white border-opacity-10 backdrop-blur-[10px] ${
                      typeof item === 'string'
                        ? 'justify-between'
                        : 'justify-start'
                    } items-center inline-flex`}
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
    </div>
  );
};
