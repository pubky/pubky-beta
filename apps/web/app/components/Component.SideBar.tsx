import { twMerge } from 'tailwind-merge';

interface SideBarProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export default function Sidebar({ children, ...rest }: SideBarProps) {
  const baseCSS =
    'hidden flex-col justify-start items-start gap-6 xl:inline-flex';
  return (
    <div {...rest} className={twMerge(baseCSS, rest.className)}>
      {children}
    </div>
  );
}
