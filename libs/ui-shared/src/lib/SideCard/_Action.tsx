import { twMerge } from 'tailwind-merge';
import { Icon } from '../Icon';
import { Button } from '../Button';

interface Action extends React.HTMLAttributes<HTMLButtonElement> {
  text: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export const Action = ({
  text,
  icon = <Icon.Tag size="16" />,
  disabled,
  ...rest
}: Action) => {
  return (
    <Button.Medium
      {...rest}
      icon={icon}
      disabled={disabled}
      className={twMerge(`h-8 px-3 py-2`, rest.className)}
    >
      {text}
    </Button.Medium>
  );
};
