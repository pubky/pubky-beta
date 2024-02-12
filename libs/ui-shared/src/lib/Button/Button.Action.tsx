import { Icon } from '../Icon';
// import { Typography } from '../Typography';

type ActionButtonProps = {
  variant?:
    | 'article'
    | 'link'
    | 'image'
    | 'music'
    | 'video'
    | 'podcast'
    | 'mode'
    | 'sort'
    | 'reach'
    | 'hub'
    | 'advanced'
    | 'plus'
    | 'minus'
    | 'custom';
  size?: 'small' | 'medium' | 'large';
  label?: string;
  counter?: number;
  svg?: React.ReactNode;
  disable?: boolean;
  width?: string;
  height?: string;
  styles?: string;
  className?: string;
};

export const Action = ({
  variant = 'article',
  size = 'medium',
  label,
  counter,
  svg,
  disable = false,
  styles = '',
  ...props
}: ActionButtonProps) => {
  let sizeClasses;
  let iconSize;
  switch (size) {
    case 'small':
      iconSize = '12px';
      sizeClasses = 'w-8 h-8 p-2';
      break;
    case 'medium':
      iconSize = '20px';
      sizeClasses = 'w-12 h-12 p-3';
      break;
    case 'large':
      iconSize = '32px';
      sizeClasses = 'w-16 h-16 p-6';
  }

  // const color = disable ? 'text-gray-500' : 'text-white';
  const colorIcon = disable ? 'grey' : undefined;
  const disabled = disable
    ? 'bg-opacity-10 cursor-auto'
    : 'hover:bg-opacity-20';
  const cssClasses = `${sizeClasses} bg-white bg-opacity-10 rounded-[48px] backdrop-blur-[20px] justify-center items-center inline-flex  ${styles} ${disabled}`;

  let icon = <Icon.Clipboard size={iconSize} color={colorIcon} />;

  switch (variant) {
    case 'article':
      icon = <Icon.Clipboard size={iconSize} color={colorIcon} />;
      break;

    case 'link':
      icon = <Icon.LinkSimple size={iconSize} color={colorIcon} />;
      break;

    case 'image':
      icon = <Icon.ImageSquare size={iconSize} color={colorIcon} />;
      break;

    case 'music':
      icon = <Icon.ImageSquare size={iconSize} color={colorIcon} />;
      break;

    case 'video':
      icon = <Icon.ImageSquare size={iconSize} color={colorIcon} />;
      break;

    case 'podcast':
      icon = <Icon.ImageSquare size={iconSize} color={colorIcon} />;
      break;

    case 'mode':
      icon = <Icon.ImageSquare size={iconSize} color={colorIcon} />;
      break;

    case 'sort':
      icon = <Icon.ImageSquare size={iconSize} color={colorIcon} />;
      break;

    case 'reach':
      icon = <Icon.ImageSquare size={iconSize} color={colorIcon} />;
      break;

    case 'hub':
      icon = <Icon.ImageSquare size={iconSize} color={colorIcon} />;
      break;

    case 'advanced':
      icon = <Icon.ImageSquare size={iconSize} color={colorIcon} />;
      break;

    case 'plus':
      icon = <Icon.ImageSquare size={iconSize} color={colorIcon} />;
      break;

    case 'minus':
      icon = <Icon.ImageSquare size={iconSize} color={colorIcon} />;
      break;

    case 'custom':
      icon = <svg />;
      break;
  }

  return (
    <button className={`${cssClasses} ${styles}`} {...props}>
      <div className="justify-center items-center inline-flex">{icon}</div>
    </button>
  );
};
