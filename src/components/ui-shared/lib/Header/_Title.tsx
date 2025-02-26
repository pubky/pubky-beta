import { twMerge } from 'tailwind-merge';
import { Typography } from '../Typography';

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  titleHeader?: any;
  className?: string;
}

const titleHidden = ['Home', 'Search', 'Hot', 'Bookmarks', 'Settings', 'Profile', 'Post', 'WhoToFollow'];

const getTitle = (titleHeader: any) => {
  if (titleHidden.includes(titleHeader)) {
    return null;
  }
  return titleHeader;
};

export const Title = ({ titleHeader, className, ...rest }: HeaderProps) => {
  const title = getTitle(titleHeader);

  return (
    <div {...rest} className={twMerge('grow', 'self-end bottom-[6px] relative', className)}>
      {title && <Typography.PageTitle className="text-opacity-50">{title}</Typography.PageTitle>}
    </div>
  );
};
