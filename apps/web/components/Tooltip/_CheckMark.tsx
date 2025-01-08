'use client';

import { ReactNode, useRef, useState } from 'react';
import { Tooltip } from '@social/ui-shared';
import clsx from 'clsx';

interface TooltipCheckMarkProps {
  content: string | ReactNode;
  children: ReactNode;
  className?: string;
}

export default function TooltipCheckMark({
  content,
  children,
  className,
}: TooltipCheckMarkProps) {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={tooltipRef}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      className={clsx('relative inline-flex', className)}
    >
      {children}

      {isVisible && (
        <Tooltip.Main
          id="tooltip-checkmark"
          className={clsx(
            'absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2',
            'w-max px-2 py-1 text-sm whitespace-nowrap',
            'bg-neutral-900 text-neutral-200 rounded-md shadow-md cursor-default',
            'transition-opacity duration-200 ease-out opacity-100',
          )}
        >
          {content}
        </Tooltip.Main>
      )}
    </div>
  );
}
