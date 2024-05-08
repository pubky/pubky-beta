import { twMerge } from 'tailwind-merge';
import { Typography } from '../Typography';

interface TransparentButtonProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  children?: string;
  icon?: React.ReactNode;
  className?: string;
  background?: string;
}

export const Transparent = ({
  children,
  icon,
  background = 'bg-white bg-opacity-10 backdrop-blur-lg hover:bg-opacity-20',
  ...rest
}: TransparentButtonProps) => {
  const baseCSS = `${background} w-full px-3 py-2 text-white rounded-[54px] justify-center items-center gap-1.5 inline-flex`;

  return (
    <button {...rest} className={twMerge(baseCSS, rest.className)}>
      {icon}
      {children && (
        <Typography.Body variant="small-bold">{children}</Typography.Body>
      )}
    </button>
  );
};
