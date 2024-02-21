import { twMerge } from 'tailwind-merge';
import { Typography } from '../Typography';

interface MediumButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  children: string;
  variant?: 'default' | 'line' | 'subtle';
  icon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export const Medium = ({
  children,
  variant = 'default',
  icon,
  disabled = false,
  ...rest
}: MediumButtonProps) => {
  let color = 'text-white';
  let colorBorder = 'border-white';
  let stateButton = 'hover:bg-opacity-20';

  if (disabled) {
    color = 'text-gray-500';
    colorBorder = 'border-gray-500';
    stateButton = 'bg-opacity-10 cursor-auto';
  }

  let cssColorButton = ` bg-white bg-opacity-10`;

  switch (variant) {
    case 'line':
      stateButton = disabled ? '' : 'hover:bg-white hover:bg-opacity-20';
      cssColorButton = ` border ${colorBorder}  `;
      break;

    case 'subtle':
      stateButton = disabled ? '' : 'hover:bg-white hover:bg-opacity-20';
      cssColorButton = ``;
      break;
  }

  const cssButton = `${stateButton} w-full h-12 px-6 py-[15px] rounded-[54px] justify-center items-center gap-2 inline-flex`;

  return (
    <button
      {...rest}
      className={twMerge(cssButton, cssColorButton, rest.className)}
    >
      {icon}
      <Typography.Body variant="small-bold" className={color}>
        {children}
      </Typography.Body>
    </button>
  );
};
