import { twMerge } from 'tailwind-merge';
import { Typography } from '../Typography';

interface CounterProps extends React.HTMLAttributes<HTMLDivElement> {
  counter: React.ReactNode;
  className?: string;
}

export const Counter = ({ counter, ...rest }: CounterProps) => {
  const baseCSS = `leading-none w-6 h-6 px-3 py-1.5 rounded-[32px] border border-white border-opacity-20 flex-col justify-center items-center gap-2 inline-flex`;

  return (
    <div {...rest} className={twMerge(baseCSS, rest.className)}>
      <Typography.Body className="tracking-normal" variant="small-bold">
        {counter}
      </Typography.Body>
    </div>
  );
};
