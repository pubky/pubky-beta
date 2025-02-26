import { Button as ButtonUI } from '../Button';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  iconOption?: React.ReactNode;
  labelIcon?: string;
  disabled?: boolean;
}

export const Button = ({ iconOption, labelIcon, disabled = false, ...rest }: ButtonProps) => {
  const baseCSS = `w-full flex items-center justify-between cursor-pointer`;
  const styleSelect = `bg-transparent text-white outline-none appearance-none font-InterTight tracking-wide`;

  return (
    <div {...rest} className={twMerge(baseCSS, styleSelect, rest.className)}>
      <ButtonUI.Action disabled={disabled} variant="custom" icon={iconOption} label={labelIcon} />
    </div>
  );
};
