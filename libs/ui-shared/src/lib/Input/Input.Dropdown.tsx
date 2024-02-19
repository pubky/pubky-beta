'use client';

import React, { useState } from 'react';
import { DropdownIcon } from '../Icon/Icon.Arrow';
import { Typography } from '../Typography';
import { Card } from '../Card';
import { Icon } from '../Icon';

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
  padding?: string;
};

export const Dropdown = ({
  items,
  label,
  title,
  subtitle,
  width = 'w-[336px]',
  padding = 'p-12',
}: DropdownProps) => {
  const [selectedItem, setSelectedItem] = useState<string | undefined>(
    typeof items[0] === 'string'
      ? (items[0] as string)
      : (items[0] as Item).option
  );
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectItem = (item: string) => {
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
      ? 'text-2xl font-normal'
      : 'text-opacity-50 text-[13px] font-semibold uppercase'
  }`;

  return (
    <div className="relative inline-block">
      <div>
        {label && (
          <Typography.Label color="text-white text-opacity-30">
            {label}
          </Typography.Label>
        )}
        <div className="relative">
          <div className="rounded-md overflow-hidden">
            <button
              type="button"
              className={`${styleSelect} w-full flex items-center justify-between`}
              onClick={toggleDropdown}
            >
              {selectedItem || 'Select'}
              {typeof items[0] === 'string' && (
                <div className={arrowStyle}>
                  <DropdownIcon color={label ? 'white' : 'gray'} />
                </div>
              )}
            </button>
            {isOpen && (
              <Card.Primary
                className={`${width} ${
                  title ? 'p-12' : 'p-5'
                } mt-4 absolute z-10 bg-gradient-to-b from-stone-950 to-black rounded-2xl shadow border border-fuchsia-600 border-opacity-30 flex-col justify-start items-start gap-12 inline-flex`}
              >
                {(title || subtitle) && (
                  <div className="mb-6 flex-col justify-start items-start flex">
                    {title && <Typography.H1>{title}</Typography.H1>}
                    {subtitle && (
                      <Typography.Body
                        variant="medium"
                        color="text-white text-opacity-80"
                      >
                        {subtitle}
                      </Typography.Body>
                    )}
                  </div>
                )}
                {items.map((item, index) => (
                  <button
                    key={index}
                    className={`${
                      title ? 'w-60' : 'w-40'
                    } h-12 py-2 shadow border-b border-white border-opacity-10 backdrop-blur-[10px] justify-between items-center inline-flex`}
                    onClick={() =>
                      handleSelectItem(
                        typeof item === 'string' ? item : item.option
                      )
                    }
                  >
                    <div className="w-14 justify-start items-center contents">
                      {typeof item === 'string' ? (
                        <Typography.Body
                          variant={title ? 'medium-bold' : 'small'}
                        >
                          {item}
                        </Typography.Body>
                      ) : (
                        <>
                          {item.icon}
                          <Typography.Body
                            variant={title ? 'medium-bold' : 'small'}
                          >
                            {item.option}
                          </Typography.Body>
                        </>
                      )}

                      {selectedItem ===
                        (typeof item === 'string' ? item : item.option) && (
                        <div>
                          {typeof item === 'string' ? (
                            <Icon.Check size={title ? '32' : '26'} />
                          ) : (
                            ''
                          )}
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
