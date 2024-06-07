import React from 'react';
import { Button } from '../Button';
import { Icon } from '../Icon';

interface SubmitActionProps extends React.HTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  children: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
}

export const SubmitAction = ({
  children = 'Publish Post',
  disabled = false,
  loading = false,
  icon = <Icon.PaperPlaneRight color={disabled ? 'gray' : 'white'} />,
  ...rest
}: SubmitActionProps) => {
  return (
    <Button.Large
      icon={icon}
      loading={loading}
      disabled={disabled}
      className="w-full"
      {...rest}
    >
      {children}
    </Button.Large>
  );
};
