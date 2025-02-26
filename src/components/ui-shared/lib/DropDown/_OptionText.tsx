import { Icon } from '../Icon';
import { twMerge } from 'tailwind-merge';
import { Typography } from '../Typography';

interface OptionTextProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  textOption?: string;
  iconText?: string;
  iconOption?: React.ReactNode;
  subtitle?: string;
  disabled?: boolean;
}

export const OptionText = ({
  isOpen,
  textOption,
  iconText,
  iconOption,
  subtitle,
  disabled = false,
  ...rest
}: OptionTextProps) => {
  const baseCSS = `w-full flex items-center justify-between cursor-pointer`;
  const arrowStyle = `ml-1 transition ease duration-300`;
  const styleSelect = `bg-transparent text-white outline-none appearance-none font-InterTight tracking-wide`;

  return (
    <div {...rest} className={twMerge(baseCSS, styleSelect, rest.className)}>
      <div className="flex-col inline-flex">
        <Typography.Label className="text-opacity-30">{subtitle}</Typography.Label>
        <Typography.Body
          className={`text-xl font-light font-InterTight leading-7 tracking-wide flex gap-1 items-center ${
            disabled ? 'text-white text-opacity-30 cursor-default' : 'text-white'
          }`}
          variant="medium"
        >
          {iconText} {iconOption} {textOption}
        </Typography.Body>
      </div>
      <div
        className={twMerge(
          arrowStyle,
          textOption ? (subtitle ? 'mt-6' : 'mt-1') : 'mt-0.5',
          isOpen ? 'rotate-180' : 'rotate-0',
          disabled && 'cursor-default',
          rest.className
        )}
      >
        <Icon.DropdownIcon color={disabled ? 'gray' : 'white'} />
      </div>
    </div>
  );
};
