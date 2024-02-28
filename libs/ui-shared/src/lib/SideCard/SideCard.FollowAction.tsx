import { twMerge } from 'tailwind-merge';
import { Button } from '../Button';
import { Icon } from '../Icon';

interface FollowAction extends React.HTMLAttributes<HTMLButtonElement> {
  text?: string;
}

export const FollowAction = ({ text = 'Follow', ...rest }: FollowAction) => {
  return (
    <Button.Medium
      {...rest}
      icon={<Icon.UserPlus size="16" />}
      className={twMerge(`w-[114px]`, rest.className)}
    >
      {text}
    </Button.Medium>
  );
};
