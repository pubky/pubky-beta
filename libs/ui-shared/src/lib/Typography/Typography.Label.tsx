import { twMerge } from 'tailwind-merge';

interface LabelProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: string;
  id?: string;
}

export const Label = ({ children, ...rest }: LabelProps) => {
  return (
    <p
      {...rest}
      className={twMerge(
        `text-[13px] font-semibold font-['Inter Tight'] uppercase tracking-wide text-white`,
        rest.className
      )}
    >
      {children}
    </p>
  );
};
