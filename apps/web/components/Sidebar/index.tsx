import { twMerge } from 'tailwind-merge';

interface SideBarProps extends React.HTMLAttributes<HTMLDivElement> {
  id?: string;
  children?: React.ReactNode;
}

export default function Sidebar({ id, children, ...rest }: SideBarProps) {
  const baseCSS = 'flex-col justify-start items-start gap-6 w-full';
  return (
    <div {...rest} id={id} className={twMerge(baseCSS, rest.className)}>
      {children}
    </div>
  );
}
