import { twMerge } from 'tailwind-merge';
import { Typography } from '../Typography';

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  titleHeader?: React.ReactNode;
  className?: string;
}

export const Title = ({ titleHeader, ...rest }: HeaderProps) => {
  return (
    <div {...rest} className={twMerge('grow', rest.className)}>
      <Typography.PageTitle className="text-opacity-50">
        {titleHeader}
      </Typography.PageTitle>
    </div>
  );
};
