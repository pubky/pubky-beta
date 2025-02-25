import { twMerge } from 'tailwind-merge';
import { Button } from '../Button';
import { Icon } from '../Icon';

interface FollowAction extends React.HTMLAttributes<HTMLButtonElement> {
  text?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'normal' | 'small';
}

export const FollowAction = ({
  text,
  icon = (
    <div>
      <Icon.UserPlus size="16" />
    </div>
  ),
  loading = false,
  variant = 'normal',
  ...rest
}: FollowAction) => {
  return (
    <div>
      {variant === 'normal' ? (
        <Button.Medium
          {...rest}
          icon={loading ? <Icon.LoadingSpin size="16" /> : icon}
          className={twMerge(`w-[50px] h-[50px]`, rest.className)}
        >
          {text}
        </Button.Medium>
      ) : (
        <Button.Action
          {...rest}
          variant="custom"
          icon={loading ? <Icon.LoadingSpin size="16" /> : icon}
          className={twMerge(`w-[32px] h-[32px] p-0`, rest.className)}
        />
      )}
    </div>
  );
};
