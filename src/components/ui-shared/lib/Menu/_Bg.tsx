import { twMerge } from 'tailwind-merge';

interface BgProps extends React.HTMLAttributes<HTMLDivElement> {
  drawerOpen: boolean;
}

export const Bg = ({ drawerOpen, ...rest }: BgProps) => {
  const baseCSS = 'fixed top-0 left-0 z-30 w-full h-screen bg-black bg-opacity-80';
  return drawerOpen && <div {...rest} className={twMerge(baseCSS, rest.className)} />;
};
