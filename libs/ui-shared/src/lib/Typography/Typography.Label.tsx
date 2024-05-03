import { twMerge } from 'tailwind-merge';

interface LabelProps extends React.HTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  id?: string;
  htmlFor?: string;
}

export const Label = ({ children, ...rest }: LabelProps) => {
  return (
    <label
      {...rest}
      className={twMerge(
        `text-[13px] font-semibold font-InterTight uppercase tracking-wide text-white`,
        rest.className
      )}
    >
      {children}
    </label>
  );
};
