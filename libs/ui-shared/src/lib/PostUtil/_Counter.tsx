import { twMerge } from 'tailwind-merge';
import { Typography } from '../Typography';

interface CounterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const Counter = ({ children, ...rest }: CounterProps) => {
  const baseCSS = `leading-none w-8 h-8 px-3 py-1.5 bg-black bg-opacity-90 rounded-[32px] border border-white border-opacity-30 flex-col justify-center items-center gap-2 inline-flex`;

  return (
    <div {...rest} className={twMerge(baseCSS, rest.className)}>
      <Typography.Body
        className="tracking-tight text-opacity-80"
        variant="small-bold"
      >
        {children}
      </Typography.Body>
    </div>
  );
};
