import { twMerge } from 'tailwind-merge';

interface RootProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  background?: string;
}

export const Main = ({
  children,
  background = 'bg-[#05050A] pb-20',
  ...rest
}: RootProps) => {
  const baseCSS = `pt-[150px] w-full h-full min-w-[420px] min-h-screen relative`;

  return (
    <div {...rest} className={twMerge(baseCSS, background, rest.className)}>
      {children}
    </div>
  );
};
