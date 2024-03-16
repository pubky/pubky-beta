import React from 'react';
import { Button } from '../Button';
import { Icon } from '../Icon';

interface SubmitActionProps extends React.HTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  children: string;
}

export const SubmitAction = ({
  children = 'Publish Post',
  icon = <Icon.PaperPlaneRight />,
  ...rest
}: SubmitActionProps) => {
  return (
    <Button.Large icon={icon} className="w-full" {...rest}>
      {children}
    </Button.Large>
  );
};
