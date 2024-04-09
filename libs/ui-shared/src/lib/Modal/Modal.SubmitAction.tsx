import React from 'react';
import { Button } from '../Button';
import { Icon } from '../Icon';

interface SubmitActionProps extends React.HTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  children: string;
  disabled?: boolean;
}

export const SubmitAction = ({
  children = 'Publish Post',
  disabled = false,
  icon = <Icon.PaperPlaneRight color={disabled ? 'gray' : 'white'} />,
  ...rest
}: SubmitActionProps) => {
  return (
    <Button.Large icon={icon} disabled={disabled} className="w-full" {...rest}>
      {children}
    </Button.Large>
  );
};
