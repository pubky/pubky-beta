import { twMerge } from 'tailwind-merge';
import { Button } from '../Button';
import { Icon } from '../Icon';

interface FollowAction extends React.HTMLAttributes<HTMLButtonElement> {
  text?: string;
  icon?: React.ReactNode;
}

export const FollowAction = ({
  text = 'Follow',
  icon = <Icon.UserPlus size="16" />,
  ...rest
}: FollowAction) => {
  return (
    <Button.Medium
      {...rest}
      icon={icon}
      className={twMerge(`w-[120px]`, rest.className)}
    >
      {text}
    </Button.Medium>
  );
};
