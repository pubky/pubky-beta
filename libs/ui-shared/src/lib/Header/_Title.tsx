import { twMerge } from 'tailwind-merge';
import { Typography } from '../Typography';

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  titleHeader?: React.ReactNode;
  className?: string;
}

const getTitle = (titleHeader: React.ReactNode) => {
  if (titleHeader === 'Feed') {
    return null;
  }
  if (titleHeader === 'HotTags') {
    return 'Hot\u00A0Tags';
  }
  return titleHeader;
};

export const Title = ({ titleHeader, className, ...rest }: HeaderProps) => {
  const title = getTitle(titleHeader);

  return (
    <div
      {...rest}
      className={twMerge('grow', className, 'self-end bottom-[4px] relative')}
    >
      {title && (
        <Typography.PageTitle className="text-opacity-50">
          {title}
        </Typography.PageTitle>
      )}
    </div>
  );
};
