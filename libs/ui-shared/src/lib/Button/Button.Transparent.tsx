import { twMerge } from 'tailwind-merge';
import { Typography } from '../Typography';

interface TransparentButtonProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  children?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const Transparent = ({
  children,
  icon,
  ...rest
}: TransparentButtonProps) => {
  const baseCSS = `w-full px-3 py-2 text-white bg-white/opacity-10 rounded-[54px] backdrop-blur-lg justify-center items-center gap-1.5 inline-flex`;

  return (
    <button {...rest} className={twMerge(baseCSS, rest.className)}>
      {icon}
      {children && (
        <Typography.Body variant="small-bold">{children}</Typography.Body>
      )}
    </button>
  );
};
