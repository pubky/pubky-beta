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
    <Button.Large svg={icon} styles="mt-6" width="w-full" {...rest}>
      {children}
    </Button.Large>
  );
};
