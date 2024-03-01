import { twMerge } from 'tailwind-merge';

interface RowProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const Row = ({ children, ...rest }: RowProps) => {
  return (
    <div {...rest} className={twMerge(`gap-6 inline-flex`, rest.className)}>
      {children}
    </div>
  );
};
