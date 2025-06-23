'use client';

import { twMerge } from 'tailwind-merge';
import { Typography } from '../Typography';
import { Icon } from '../Icon';
import { Tooltip } from '../Tooltip';
import { useState } from 'react';
import { useIsMobile } from '@/hooks/useIsMobile';
import { Utils } from '@/components/utils-shared';

interface RootProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  articleView?: boolean;
  repostView?: boolean;
}

export const Time = ({ children, articleView, repostView, ...rest }: RootProps) => {
  const isMobile = useIsMobile(1280);
  const [showTooltip, setShowTooltip] = useState(false);
  const baseCSS = `grow justify-end items-center gap-1 flex mt-2`;
  const tooltipCSS = (articleView || repostView) && 'left-auto -right-[75px]';

  return (
    <div className={twMerge(baseCSS, rest.className)}>
      {children ? (
        <Tooltip.RootSmall delay={500} setShowTooltip={setShowTooltip}>
          <div className="flex items-center gap-1">
            <Icon.Clock size="16" color="#FFFFFF4D" />
            <Typography.Caption
              {...rest}
              variant="bold"
              className="text-white text-opacity-30 uppercase tracking-normal"
            >
              {Utils.timeAgo(Number(children), isMobile)}
            </Typography.Caption>
          </div>
          {showTooltip && !isMobile && (
            <Tooltip.Small className={`${tooltipCSS} w-max p-2 bottom-[35px]`}>
              <Typography.Body variant="small" className="text-opacity-50">
                {children && typeof children === 'number' ? Utils.formatTimestamp(children) : String(children)}
              </Typography.Body>
            </Tooltip.Small>
          )}
        </Tooltip.RootSmall>
      ) : (
        <div className="h-2.5 bg-gray-300 dark:bg-gray-700 bg-opacity-50 dark:bg-opacity-50 rounded-full w-24"></div>
      )}
    </div>
  );
};
