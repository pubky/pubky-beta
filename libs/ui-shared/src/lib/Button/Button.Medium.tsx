import { Icon } from '../Icon';
import { Typography } from '../Typography';

type MediumButtonProps = {
  children: string;
  variant?: 'default' | 'line' | 'subtle';
  svg?: React.ReactNode;
  disable?: boolean;
  width?: string;
  height?: string;
  styles?: string;
  href?: string;
  className?: string;
};

export const Medium = ({
  children,
  variant = 'default',
  svg,
  disable = false,
  width = 'w-full',
  height = 'h-12',
  styles = '',
  href,
  ...props
}: MediumButtonProps) => {
  const color = disable ? 'text-gray-500' : 'text-white';
  const colorIcon = disable ? 'grey' : undefined;
  const colorBorder = disable ? 'border-gray-500' : 'border-white';
  let disabled = disable ? 'bg-opacity-10 cursor-auto' : 'hover:bg-opacity-20';
  let cssClasses = `${width} ${height} px-6 py-[15px] bg-white bg-opacity-10 rounded-[54px] justify-center items-center gap-2 inline-flex ${styles} ${disabled}`;

  switch (variant) {
    case 'line':
      disabled = disable ? '' : 'hover:bg-white hover:bg-opacity-20';
      cssClasses = `${width} ${height} px-6 py-[15px] rounded-[54px] border ${colorBorder} justify-center items-center gap-2 inline-flex ${disabled}`;
      break;

    case 'subtle':
      disabled = disable ? '' : 'hover:bg-white hover:bg-opacity-20';
      cssClasses = `${width} ${height} px-6 py-[15px] rounded-[54px] justify-center items-center gap-2 inline-flex ${disabled}`;
      break;
  }

  return (
    <a href={href}>
      <button className={`${cssClasses} ${styles}`} {...props}>
        <div className="justify-center items-center flex">
          {svg ? svg : <Icon.Tag color={colorIcon} />}
        </div>
        <Typography.Body variant="small-bold" color={color}>
          {children}
        </Typography.Body>
      </button>
    </a>
  );
};
