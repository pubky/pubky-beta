import { twMerge } from 'tailwind-merge';
import { Content } from '../Content';

interface RootProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const Root = ({ children, ...rest }: RootProps) => {
  return (
    <div
      {...rest}
      className={twMerge(
        `border-t border-b border-white border-opacity-10`,
        rest.className
      )}
    >
      <Content.Grid className="flex justify-between">{children}</Content.Grid>
    </div>
  );
};
