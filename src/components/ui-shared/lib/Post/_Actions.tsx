import { twMerge } from 'tailwind-merge';

interface ActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  id?: string;
  children?: React.ReactNode;
}

export const Actions = ({ children, id, ...rest }: ActionsProps) => {
  return (
    <div {...rest} id={id} className={twMerge(`justify-start items-start gap-2 flex`, rest.className)}>
      {children}
    </div>
  );
};
