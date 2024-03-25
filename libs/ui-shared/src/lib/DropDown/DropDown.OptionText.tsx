import { Icon } from '../Icon';
import { twMerge } from 'tailwind-merge';
import { Typography } from '../Typography';

interface OptionTextProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  textOption?: string;
}

export const OptionText = ({
  isOpen,
  textOption,
  ...rest
}: OptionTextProps) => {
  const baseCSS = `w-full flex items-center justify-between cursor-pointer`;
  const arrowStyle = `ml-1 transition ease duration-300`;
  const styleSelect = `bg-transparent text-white outline-none appearance-none font-InterTight tracking-wide`;

  return (
    <div {...rest} className={twMerge(baseCSS, styleSelect, rest.className)}>
      <Typography.Label className="text-opacity-50">
        {textOption}
      </Typography.Label>
      <div
        className={twMerge(
          arrowStyle,
          textOption ? 'mt-1' : 'mt-0.5',
          isOpen ? 'rotate-180' : 'rotate-0',
          rest.className
        )}
      >
        <Icon.DropdownIcon color="gray" />
      </div>
    </div>
  );
};
