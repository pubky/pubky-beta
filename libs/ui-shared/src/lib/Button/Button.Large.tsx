import { Typography } from '../Typography';

type LargeButtonProps = {
  children: string;
  variant?: 'primary' | 'secondary';
  svg?: React.ReactNode;
  disable?: boolean;
  width?: string;
  height?: string;
  styles?: string;
};

export const Large = ({
  children,
  variant = 'primary',
  svg,
  disable = false,
  width = '100%',
  height = '58px',
  styles = '',
  ...props
}: LargeButtonProps) => {
  const color = disable ? 'text-gray-500' : 'text-white';
  let disabled = disable
    ? 'border-opacity-30 bg-opacity-10'
    : 'hover:bg-opacity-60 cursor-pointer';
  let cssClasses = `w-[${width}] h-[${height}] px-6 py-5 bg-fuchsia-500 bg-opacity-30 rounded-[64px] shadow border border-fuchsia-500 backdrop-blur-[10px] flex-col justify-center items-center gap-10 inline-flex ${disabled}`;

  switch (variant) {
    case 'secondary':
      disabled = disable ? 'hover:bg-opacity-30 cursor-pointer' : '';
      cssClasses = `w-[${width}] h-[${height}] px-6 py-5 bg-white bg-opacity-20 rounded-[64px] shadow backdrop-blur-[10px] flex-col justify-center items-center gap-10 inline-flex ${disabled}`;
      break;
  }

  return (
    <div className={`${cssClasses} ${styles}`} {...props}>
      <div className="justify-start items-center gap-1.5 inline-flex">
        {svg}
        <Typography.Body color={color} variant="small-bold">
          {children}
        </Typography.Body>
      </div>
    </div>
  );
};
