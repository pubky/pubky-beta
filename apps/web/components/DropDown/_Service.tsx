import { Button, Icon, Typography } from '@social/ui-shared';
import { twMerge } from 'tailwind-merge';
import React from 'react';

interface ServiceProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  contact?: React.ReactNode;
  price: React.ReactNode;
  description: React.ReactNode;
  open: boolean;
  setOpen: () => void;
  removeService?: () => void;
  buyService?: () => void;
}

export default function Service({
  title,
  contact,
  price,
  description,
  open,
  setOpen,
  removeService,
  buyService,
  ...rest
}: ServiceProps) {
  const baseCSS =
    'cursor-pointer relative w-full p-6 rounded-2xl border border-white border-opacity-20 hover:border-opacity-30 flex-col justify-start items-start gap-6 inline-flex';

  return (
    <div onClick={() => setOpen()} className={twMerge(baseCSS, rest.className)}>
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Typography.Body variant="medium-bold">{title}</Typography.Body>
          {contact && (
            <>
              <Typography.Body variant="medium" className="text-opacity-50">
                -
              </Typography.Body>
              <Typography.Body className="text-opacity-80" variant="small-bold">
                {contact}
              </Typography.Body>
            </>
          )}
        </div>
        <div className="flex gap-2 items-center">
          <Typography.Body className="text-opacity-80" variant="small-bold">
            {price} btc
          </Typography.Body>
          {removeService && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                removeService();
              }}
              className="p-2 hover:bg-white hover:bg-opacity-10 rounded-full"
            >
              <Icon.Trash size="16" />
            </div>
          )}
          {buyService && (
            <Button.Medium
              onClick={(e) => {
                e.stopPropagation();
                buyService();
              }}
              className="w-auto h-[20px]"
            >
              Buy
            </Button.Medium>
          )}
          <div
            className={twMerge(
              'transform transition-transform duration-300',
              open && 'rotate-90'
            )}
          >
            <Icon.Next size="16" />
          </div>
        </div>
      </div>
      <div
        className={twMerge(
          'transition-all duration-300 ease-in-out overflow-hidden',
          open ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 -mt-6'
        )}
      >
        <Typography.Body className="text-opacity-80 mr-2" variant="small">
          {description}
        </Typography.Body>
      </div>
    </div>
  );
}
