import { twMerge } from 'tailwind-merge';

interface ActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const Actions = ({ children, ...rest }: ActionsProps) => {
  return (
    <div
      {...rest}
      className={twMerge(
        `justify-start items-start gap-2 flex`,
        rest.className
      )}
    >
      {children}
    </div>
  );
};
