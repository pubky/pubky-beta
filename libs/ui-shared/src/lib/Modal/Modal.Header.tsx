import { Typography } from '../Typography';

interface HeaderProps {
  title: string;
  children: React.ReactNode;
}

export const Header = ({ title, children }: HeaderProps) => {
  return (
    <div className="flex">
      <Typography.H1>{title}</Typography.H1>
      <div className="ml-4">
        <div className="gap-3 flex mt-2">{children}</div>
      </div>
    </div>
  );
};
