import { twMerge } from 'tailwind-merge';
import { Typography } from '../Typography';

interface CounterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  textCSS?: string;
}

export const Counter = ({ children, textCSS, ...rest }: CounterProps) => {
  const baseCSS = `leading-none w-8 h-8 px-3 py-1.5 bg-black bg-opacity-90 rounded-[32px] border border-white border-opacity-30 flex-col justify-center items-center gap-2 inline-flex`;

  return (
    <div {...rest} className={twMerge(baseCSS, rest.className)}>
      <Typography.Body
        className={twMerge(textCSS, 'tracking-tight')}
        variant="small"
      >
        {children}
      </Typography.Body>
    </div>
  );
};
