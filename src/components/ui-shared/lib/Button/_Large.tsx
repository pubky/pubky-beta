import { twMerge } from 'tailwind-merge';
import { Typography } from '../Typography';
import { Icon } from '../Icon';

interface LargeButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary';
  icon?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  colorText?: string;
}

export const Large = ({
  children,
  variant = 'primary',
  icon,
  loading = false,
  disabled = false,
  colorText = 'text-white',
  ...rest
}: LargeButtonProps) => {
  let stateButton = 'hover:bg-opacity-20';

  if (disabled) {
    colorText = 'text-opacity-30';
    stateButton = 'border-opacity-30 bg-opacity-10 cursor-auto';
  }

  let cssColorButton = ` bg-white bg-opacity-10 border border-white`;

  switch (variant) {
    case 'secondary':
      stateButton = disabled ? '' : 'hover:bg-opacity-20';
      cssColorButton = ` bg-white bg-opacity-10 `;
      break;
  }

  const cssButton = `${stateButton} w-full h-[58px] px-6 py-5 rounded-[64px] shadow backdrop-blur-[10px] justify-center items-center gap-2 inline-flex`;

  return (
    <button {...rest} className={twMerge(cssButton, cssColorButton, rest.className)}>
      {loading ? <Icon.LoadingSpin size="20" /> : icon && <div>{icon}</div>}
      {children && (
        <Typography.Body className={`tracking-normal ${colorText}`} variant="small-bold">
          {children}
        </Typography.Body>
      )}
    </button>
  );
};
