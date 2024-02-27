import { Typography } from '@social/ui-shared';
import { twMerge } from 'tailwind-merge';

interface UserDetailsProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: number;
}
export const UserDetails = ({ label, value, ...rest }: UserDetailsProps) => {
  const baseCSS = 'flex-col justify-start items-start gap-1 inline-flex';
  return (
    <div {...rest} className={twMerge(baseCSS, rest.className)}>
      <Typography.Label className="text-opacity-30 -mb-1">
        {label}
      </Typography.Label>
      <Typography.Body variant="medium-bold">{value}</Typography.Body>
    </div>
  );
};
