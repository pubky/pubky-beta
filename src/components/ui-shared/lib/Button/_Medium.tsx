import { twMerge } from 'tailwind-merge';
import { Typography } from '../Typography';
import { Icon } from '../Icon';

interface MediumButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'default' | 'line' | 'subtle';
  icon?: React.ReactNode;
  textCSS?: string;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  ref?: React.Ref<HTMLButtonElement>;
}

export const Medium = ({
  children,
  variant = 'default',
  icon,
  textCSS,
  disabled = false,
  loading = false,
  ...rest
}: MediumButtonProps) => {
  let color = 'text-white';
  let colorBorder = 'border-white';
  let stateButton = 'hover:bg-opacity-20';

  if (disabled) {
    color = 'text-opacity-30';
    colorBorder = 'border-white/30';
    stateButton = 'bg-opacity-10 cursor-auto';
  }

  let cssColorButton = ` bg-white bg-opacity-10`;

  switch (variant) {
    case 'line':
      stateButton = disabled ? 'cursor-default' : 'hover:bg-white hover:bg-opacity-20';
      cssColorButton = ` border ${colorBorder}  `;
      break;

    case 'subtle':
      stateButton = disabled ? 'cursor-default' : 'hover:bg-white hover:bg-opacity-20';
      cssColorButton = ``;
      break;
  }

  const cssButton = `${stateButton} w-full h-12 px-6 py-[15px] rounded-[54px] justify-center items-center gap-2 inline-flex`;

  return (
    <button {...rest} ref={rest.ref} className={twMerge(cssButton, cssColorButton, rest.className)}>
      {loading ? (
        <div>
          <Icon.LoadingSpin size="16" />
        </div>
      ) : (
        icon && <div>{icon}</div>
      )}
      {children && (
        <Typography.Body variant="small-bold" className={twMerge(color, textCSS)}>
          {children}
        </Typography.Body>
      )}
    </button>
  );
};
