import { twMerge } from 'tailwind-merge';
import { Button } from '../Button';
import { Icon } from '../Icon';

interface FollowAction extends React.HTMLAttributes<HTMLButtonElement> {
  text?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
}

export const FollowAction = ({
  text,
  icon = <Icon.UserPlus size="16" />,
  loading = false,
  ...rest
}: FollowAction) => {
  return (
    <Button.Medium
      {...rest}
      icon={loading ? <Icon.LoadingSpin size="16" /> : icon}
      className={twMerge(`w-[50px]`, rest.className)}
    >
      {text}
    </Button.Medium>
  );
};
