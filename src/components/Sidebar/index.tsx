import { twMerge } from 'tailwind-merge';

interface SideBarProps extends React.HTMLAttributes<HTMLDivElement> {
  id?: string;
  children?: React.ReactNode;
  ref?: React.RefObject<HTMLDivElement>;
}

export default function Sidebar({ id, children, ref, ...rest }: SideBarProps) {
  const baseCSS = 'flex-col justify-start items-start gap-6 w-full';
  return (
    <div {...rest} ref={ref} id={id} className={twMerge(baseCSS, rest.className)}>
      {children}
    </div>
  );
}
