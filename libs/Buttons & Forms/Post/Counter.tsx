import { Typography } from '../Typography';

type CounterProps = {
  counter: number;
  width?: string;
  height?: string;
  styles?: string;
  className?: string;
};

export const Counter = ({
  width = 'w-8',
  height = 'h-8',
  counter,
  styles,
  ...props
}: CounterProps) => {
  const cssStyle = `${width} ${height} px-3 py-1.5 rounded-[32px] border border-white border-opacity-20 flex-col justify-center items-center gap-2 inline-flex`;
  return (
    <div className={`${cssStyle} ${styles}`} {...props}>
      <Typography.Body variant="small-bold">{counter}</Typography.Body>
    </div>
  );
};
