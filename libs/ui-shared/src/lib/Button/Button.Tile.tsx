import { Icon } from '../Icon';
import { Typography } from '../Typography';

type TileButtonProps = {
  children: string;
  svg?: React.ReactNode;
  disable?: boolean;
  width?: string;
  height?: string;
  styles?: string;
  className?: string;
};

export const Tile = ({
  children,
  svg,
  disable = false,
  width = 'w-full',
  height = 'h-[66px]',
  styles = '',
  ...props
}: TileButtonProps) => {
  const color = disable ? 'text-gray-500' : 'text-white';
  const colorIcon = disable ? 'grey' : undefined;
  const colorBorder = disable
    ? 'border-gray-500'
    : 'border-white hover:border-fuchsia-500';
  const disabled = disable
    ? 'bg-opacity-10'
    : 'hover:bg-fuchsia-500 hover:bg-opacity-20';

  return (
    <button
      className={`${width} ${height} p-6 rounded-2xl border ${colorBorder} border-opacity-30 border-dashed justify-center items-center gap-2 inline-flex ${disabled} ${styles}`}
      {...props}
    >
      <div className="justify-center items-center flex">
        {svg ? svg : <Icon.Plus color={colorIcon} />}
      </div>
      <Typography.Body variant="small-bold" color={color}>
        {children}
      </Typography.Body>
    </button>
  );
};
