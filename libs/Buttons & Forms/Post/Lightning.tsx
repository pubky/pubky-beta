import { Icon } from '../Icon';

type LightningProps = {
  width?: string;
  height?: string;
  styles?: string;
  className?: string;
};

export const Lightning = ({
  width = 'w-[10.33px]',
  height = 'h-4',
  styles,
  ...props
}: LightningProps) => {
  return (
    <div className={`${width} ${height} relative ${styles}`} {...props}>
      <Icon.Lightning />
    </div>
  );
};
