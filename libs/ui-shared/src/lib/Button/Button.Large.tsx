import { Typography } from '../Typography';

type LargeButtonProps = {
  children: string;
  variant?: 'primary' | 'secondary';
  svg?: React.ReactNode;
  disable?: boolean;
  width?: string;
  height?: string;
  styles?: string;
  id?: string;
};

export const Large = ({
  children,
  variant = 'primary',
  svg,
  disable = false,
  width = '100%',
  height = '58px',
  styles,
  id,
  ...props
}: LargeButtonProps) => {
  let cssClasses = `w-[${width}] h-[${height}] px-6 py-5 bg-fuchsia-500 bg-opacity-30 
  rounded-[64px] shadow border border-fuchsia-500 
  backdrop-blur-[10px] flex-col justify-center items-center gap-10 inline-flex ${
    disable
      ? 'border-opacity-30 bg-opacity-10'
      : 'hover:bg-opacity-60 cursor-pointer'
  }`;

  switch (variant) {
    case 'secondary':
      cssClasses = `w-[${width}] h-[${height}] px-6 py-5 bg-white bg-opacity-20 
      rounded-[64px] shadow backdrop-blur-[10px] 
      flex-col justify-center items-center gap-10 inline-flex ${
        !disable && 'hover:bg-opacity-30 cursor-pointer'
      }`;
      break;
  }

  return (
    <div key={id} className={`${cssClasses} ${styles}`} {...props}>
      <div className="justify-start items-center gap-1.5 inline-flex">
        {svg}
        <Typography.Body
          color={disable ? 'text-gray-500' : 'text-white'}
          variant="small-bold"
        >
          {children}
        </Typography.Body>
      </div>
    </div>
  );
};
