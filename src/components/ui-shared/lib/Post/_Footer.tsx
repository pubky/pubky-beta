import { twMerge } from 'tailwind-merge';

interface FooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const Footer = ({ children, ...rest }: FooterProps) => {
  return (
    <div {...rest} className={twMerge(`justify-start items-start gap-2 flex`, rest.className)}>
      {children}
    </div>
  );
};
