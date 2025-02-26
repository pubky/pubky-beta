import { twMerge } from 'tailwind-merge';
import { Typography } from '../Typography';

interface StatProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  children: React.ReactNode;
  className?: string;
}

export const Stat = ({ label, children, ...rest }: StatProps) => {
  const baseCSS = `w-[84px] h-[66px] flex-col justify-start items-start gap-1 inline-flex`;
  return (
    <div {...rest} className={twMerge(baseCSS, rest.className)}>
      {label && <Typography.Label className="text-opacity-30">{label}</Typography.Label>}
      <Typography.H1>{children}</Typography.H1>
    </div>
  );
};
