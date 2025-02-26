import { twMerge } from 'tailwind-merge';
import { Typography } from '../Typography';

interface TabButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  active?: boolean;
  className?: string;
}

export const Tab = ({ children, icon, active = false, ...rest }: TabButtonProps) => {
  const bgCSS = active
    ? 'border-t border-white bg-white bg-opacity-20'
    : 'bg-white bg-opacity-10 hover:border-white hover:bg-white hover:bg-opacity-20';
  const baseCSS = `h-12 px-4 py-3 rounded-tl-2xl rounded-tr-2xl justify-center items-center gap-2 inline-flex`;

  return (
    <button {...rest} className={twMerge(bgCSS, baseCSS, rest.className)}>
      {icon}
      <Typography.Caption variant="bold">{children}</Typography.Caption>
    </button>
  );
};
