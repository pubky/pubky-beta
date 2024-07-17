import { twMerge } from 'tailwind-merge';

interface RootProps extends React.HTMLAttributes<HTMLDivElement> {
  drawerRef: React.RefObject<HTMLDivElement>;
  drawerOpen: boolean;
  position?: 'left' | 'right';
}

export const Root = ({
  drawerRef,
  drawerOpen,
  children,
  position = 'right',
  ...rest
}: RootProps) => {
  const positionDrawer = position === 'left' ? 'left-0' : 'right-0';
  const baseCSS = `${positionDrawer} w-[80%] md:w-[385px] fixed top-0 z-50 h-screen transition-transform p-12 bg-gradient-to-br from-black to-[#0e0e18] shadow border-r border-white border-opacity-20 justify-start items-start`;
  const drawer = drawerOpen ? '' : 'translate-x-full hidden';
  return (
    <div
      {...rest}
      ref={drawerRef}
      id="drawer-example"
      className={twMerge(baseCSS, drawer, rest.className)}
      tabIndex={-1}
      aria-labelledby="drawer-label"
    >
      {children}
    </div>
  );
};
