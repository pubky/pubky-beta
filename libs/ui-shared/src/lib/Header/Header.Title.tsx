import { Typography } from '../Typography';

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  title: string;
}

export const Title = ({ title, ...rest }: HeaderProps) => {
  return (
    <div className="grow pr-6">
      <Typography.PageTitle {...rest} className="text-white text-opacity-50">
        {title}
      </Typography.PageTitle>
    </div>
  );
};
