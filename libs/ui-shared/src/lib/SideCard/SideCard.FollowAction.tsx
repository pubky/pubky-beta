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
  text = 'Follow',
  icon = <Icon.UserPlus size="16" />,
  loading = false,
  ...rest
}: FollowAction) => {
  return (
    <Button.Medium
      {...rest}
      icon={icon}
      loading={loading}
      className={twMerge(`w-[120px]`, rest.className)}
    >
      {loading ? 'Loading' : text}
    </Button.Medium>
  );
};
