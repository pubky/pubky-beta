import { twMerge } from 'tailwind-merge';

interface RootProps extends React.HTMLAttributes<HTMLDivElement> {
  drawerRef: React.RefObject<HTMLDivElement>;
  drawerOpen: boolean;
}

export const Root = ({
  drawerRef,
  drawerOpen,
  children,
  ...rest
}: RootProps) => {
  const baseCSS = `w-[80%] md:w-[385px] fixed top-0 right-0 z-40 h-screen transition-transform p-12 bg-black shadow border-l border-fuchsia-500 border-opacity-30 justify-start items-start`;
  const drawer = drawerOpen ? '' : 'translate-x-full hidden';
  return (
    <div
      {...rest}
      ref={drawerRef}
      id="drawer-example"
      className={twMerge(baseCSS, drawer)}
      tabIndex={-1}
      aria-labelledby="drawer-label"
    >
      {children}
    </div>
  );
};
