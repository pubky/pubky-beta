import { Typography } from '../Typography';
import { twMerge } from 'tailwind-merge';

interface DropdownProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  iconLabel?: React.ReactNode;
  label?: string;
  reference: React.RefObject<HTMLDivElement>;
}

export const Root = ({
  iconLabel,
  label = '',
  children,
  reference,
  ...rest
}: DropdownProps) => {
  const baseCSS = `relative inline-block`;

  return (
    <div {...rest} className={twMerge(baseCSS, rest.className)} ref={reference}>
      <div>
        {label && (
          <Typography.Label className="text-white text-opacity-30">
            {label}
          </Typography.Label>
        )}
        <div className="relative">
          <div className="rounded-md overflow-hidden">{children}</div>
        </div>
      </div>
    </div>
  );
};
