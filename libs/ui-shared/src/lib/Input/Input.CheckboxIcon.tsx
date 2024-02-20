'use client';

import { Check } from '../Icon/Icon.System';

interface CheckboxIconProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
}

export const CheckboxIcon = ({
  icon = <Check size="22" />,
  ...rest
}: CheckboxIconProps) => {
  return (
    <div className="absolute mt-1 ml-1" {...rest}>
      {icon}
    </div>
  );
};
