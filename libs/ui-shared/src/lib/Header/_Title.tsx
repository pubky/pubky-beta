import { twMerge } from 'tailwind-merge';
import { Typography } from '../Typography';

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  titleHeader?: React.ReactNode;
  className?: string;
}

const getTitle = (titleHeader: React.ReactNode) => {
  if (titleHeader) {
    return null;
  }
};

export const Title = ({ titleHeader, className, ...rest }: HeaderProps) => {
  const title = getTitle(titleHeader);

  return (
    <div
      {...rest}
      className={twMerge('grow', 'self-end bottom-[6px] relative', className)}
    >
      {title && (
        <Typography.PageTitle className="text-opacity-50">
          {title}
        </Typography.PageTitle>
      )}
    </div>
  );
};
