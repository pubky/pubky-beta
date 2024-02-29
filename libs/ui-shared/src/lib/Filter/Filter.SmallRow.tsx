import { twMerge } from 'tailwind-merge';

interface SmallRowProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const SmallRow = ({ children, ...rest }: SmallRowProps) => {
  return (
    <div {...rest} className={twMerge(`gap-3 flex`, rest.className)}>
      {children}
    </div>
  );
};
