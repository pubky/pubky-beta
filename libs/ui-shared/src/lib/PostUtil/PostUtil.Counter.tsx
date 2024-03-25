import { twMerge } from 'tailwind-merge';
import { Typography } from '../Typography';

interface CounterProps extends React.HTMLAttributes<HTMLDivElement> {
  counter: number | string;
  className?: string;
}

export const Counter = ({ counter, ...rest }: CounterProps) => {
  const baseCSS = `w-8 h-8 px-3 py-1.5 rounded-[32px] border border-white border-opacity-20 flex-col justify-center items-center gap-2 inline-flex`;
  return (
    <div {...rest} className={twMerge(baseCSS, rest.className)}>
      <Typography.Body variant="small-bold">{counter}</Typography.Body>
    </div>
  );
};
