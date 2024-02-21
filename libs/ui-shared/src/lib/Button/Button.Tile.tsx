import { twMerge } from 'tailwind-merge';
import { Typography } from '../Typography';

interface TileButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  children: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export const Tile = ({
  children,
  icon,
  disabled = false,
  ...rest
}: TileButtonProps) => {
  let color = 'text-white';
  let colorBorder = 'border-white hover:border-fuchsia-500';
  let stateButton = 'hover:bg-fuchsia-500 hover:bg-opacity-20';

  if (disabled) {
    color = 'text-gray-500';
    colorBorder = 'border-gray-500';
    stateButton = 'bg-opacity-10';
  }

  return (
    <button
      {...rest}
      className={twMerge(
        `${stateButton} ${colorBorder} w-full h-[66px] p-6 rounded-2xl border border-opacity-30 border-dashed justify-center items-center gap-2 inline-flex`,
        rest.className
      )}
    >
      {icon}
      <Typography.Body variant="small-bold" className={color}>
        {children}
      </Typography.Body>
    </button>
  );
};
