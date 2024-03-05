import { twMerge } from 'tailwind-merge';

interface RootProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  background?: string;
}

export const Main = ({
  children,
  background = 'bg-gradient-to-br from-black to-[#0e0e18] pb-20',
  ...rest
}: RootProps) => {
  const baseCSS = `w-full h-full min-w-[420px] min-h-screen relative`;

  return (
    <div {...rest} className={twMerge(baseCSS, background, rest.className)}>
      {children}
    </div>
  );
};
