import { twMerge } from 'tailwind-merge';

interface SelectProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const Select = ({ children, ...rest }: SelectProps) => {
  return (
    <div {...rest} className={twMerge(`gap-4 inline-flex`, rest.className)}>
      {children}
    </div>
  );
};
