import { twMerge } from 'tailwind-merge';
import { Typography } from '../Typography';

interface TileButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  children: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export const Tile = ({ children, icon, disabled = false, ...rest }: TileButtonProps) => {
  const baseCSS = `w-full h-[66px] p-6 rounded-2xl border border-opacity-30 border-dashed justify-center items-center gap-2 inline-flex border-white hover:border-white hover:bg-white hover:bg-opacity-20`;
  const bodyCSS = disabled ? 'text-gray-500' : 'text-white';
  const disabledCSS = disabled
    ? 'border-gray-500 bg-opacity-10 hover:border-white hover:border-opacity-30 hover:bg-opacity-0 hover:bg-white cursor-auto'
    : '';

  return (
    <button {...rest} className={twMerge(baseCSS, disabledCSS, rest.className)}>
      {icon}
      <Typography.Body variant="small-bold" className={bodyCSS}>
        {children}
      </Typography.Body>
    </button>
  );
};
