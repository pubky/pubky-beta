import { twMerge } from 'tailwind-merge';

interface SideBarProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export default function Sidebar({ children, ...rest }: SideBarProps) {
  const baseCSS = 'flex-col justify-start items-start gap-6';
  return (
    <div {...rest} className={twMerge(baseCSS, rest.className)}>
      {children}
    </div>
  );
}
