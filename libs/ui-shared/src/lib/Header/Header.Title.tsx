import { twMerge } from 'tailwind-merge';
import { Typography } from '../Typography';

interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
}

export const Title = ({ title, ...rest }: HeaderProps) => {
  return (
    <div {...rest} className={twMerge('grow pr-6', rest.className)}>
      <Typography.PageTitle className="text-opacity-50">
        {title}
      </Typography.PageTitle>
    </div>
  );
};
