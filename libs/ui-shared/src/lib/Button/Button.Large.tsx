import { twMerge } from 'tailwind-merge';
import { Typography } from '../Typography';

interface LargeButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  children?: string;
  variant?: 'primary' | 'secondary';
  icon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export const Large = ({
  children,
  variant = 'primary',
  icon,
  disabled = false,
  ...rest
}: LargeButtonProps) => {
  let colorText = 'text-white';
  let stateButton = 'hover:bg-opacity-60';

  if (disabled) {
    colorText = 'text-gray-500';
    stateButton = 'border-opacity-30 bg-opacity-10 cursor-auto';
  }

  let cssColorButton = ` bg-fuchsia-500 bg-opacity-30 border border-fuchsia-500`;

  switch (variant) {
    case 'secondary':
      stateButton = disabled ? 'hover:bg-opacity-30' : '';
      cssColorButton = ` bg-white bg-opacity-20 `;
      break;
  }

  let cssButton = `${stateButton} w-full h-[58px] px-6 py-5 rounded-[64px] shadow backdrop-blur-[10px] justify-center items-center gap-2 inline-flex`;
  cssButton += cssColorButton;

  return (
    <button {...rest} className={twMerge(`${cssButton}`, rest.className)}>
      {icon}
      {children && (
        <Typography.Body className={colorText} variant="small-bold">
          {children}
        </Typography.Body>
      )}
    </button>
  );
};
