import { Typography } from '../Typography';

type StatProps = {
  width?: string;
  height?: string;
  label?: string;
  children: React.ReactNode;
  styles?: string;
  className?: string;
};

export const Stat = ({
  width = 'w-[84px]',
  height = 'h-[66px]',
  styles,
  label = 'Followers',
  children,
  ...props
}: StatProps) => {
  const cssStyle = `${width} ${height} flex-col justify-start items-start gap-1 inline-flex`;
  return (
    <div className={`${cssStyle} ${styles}`} {...props}>
      <Typography.Label color="text-white text-opacity-30">
        {label}
      </Typography.Label>
      <Typography.H1>{children}</Typography.H1>
    </div>
  );
};
