import { twMerge } from 'tailwind-merge';
import { Typography } from '../Typography';
import { Icon } from '../Icon';

interface TransparentButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  children?: string;
  icon?: React.ReactNode;
  className?: string;
  background?: string;
  disabled?: boolean;
  loading?: boolean;
}

export const Transparent = ({
  children,
  icon,
  background = 'bg-white bg-opacity-10 backdrop-blur-lg',
  disabled,
  loading,
  ...rest
}: TransparentButtonProps) => {
  const disabledCSS = disabled ? `${background} cursor-default` : `${background} hover:bg-opacity-20`;
  const baseCSS = `${disabledCSS} w-full px-3 py-2 rounded-[54px] justify-center items-center gap-1.5 inline-flex`;

  return (
    <button {...rest} className={twMerge(baseCSS, rest.className)}>
      {loading ? <Icon.LoadingSpin size="24" /> : icon}
      {children && (
        <Typography.Body className={`text-[13px] ${disabled ? 'text-white text-opacity-20' : ''}`} variant="small-bold">
          {children}
        </Typography.Body>
      )}
    </button>
  );
};
