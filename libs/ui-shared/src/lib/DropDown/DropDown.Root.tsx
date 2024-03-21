import { twMerge } from 'tailwind-merge';

interface DropdownProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  reference: React.RefObject<HTMLDivElement>;
}

export const Root = ({ children, reference, ...rest }: DropdownProps) => {
  const baseCSS = `relative inline-block`;

  return (
    <div {...rest} className={twMerge(baseCSS, rest.className)} ref={reference}>
      {children}
    </div>
  );
};
