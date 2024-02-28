import { twMerge } from 'tailwind-merge';
import { Icon } from '../Icon';
import { Button } from '../Button';

interface Action extends React.HTMLAttributes<HTMLButtonElement> {
  text: string;
  icon?: React.ReactNode;
}

export const Action = ({
  text,
  icon = <Icon.Tag size="16" />,
  ...rest
}: Action) => {
  return (
    <Button.Medium
      {...rest}
      icon={icon}
      className={twMerge(`mt-6`, rest.className)}
    >
      {text}
    </Button.Medium>
  );
};
