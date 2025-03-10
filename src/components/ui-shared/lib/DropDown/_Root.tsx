import { twMerge } from 'tailwind-merge';

interface DropdownProps extends React.HTMLAttributes<HTMLDivElement> {
  idPrefix?: string;
  children: React.ReactNode;
  reference: React.RefObject<HTMLDivElement>;
}

export const Root = ({ idPrefix, children, reference, ...rest }: DropdownProps) => {
  const baseCSS = `relative table`;

  return (
    <div
      {...(idPrefix ? { id: `${idPrefix}-dropdown` } : {})}
      {...rest}
      className={twMerge(baseCSS, rest.className)}
      ref={reference}
    >
      {children}
    </div>
  );
};
