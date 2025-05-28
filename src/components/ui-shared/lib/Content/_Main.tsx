import { twMerge } from 'tailwind-merge';

interface RootProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  background?: string;
  shadowBottom?: boolean;
}

export const Main = ({ children, background = 'bg-[#05050A]', shadowBottom, ...rest }: RootProps) => {
  const baseCSS = `pt-[100px] lg:pt-[150px] w-full h-full pb-20 min-h-screen relative`;

  return (
    <div {...rest} className={twMerge(baseCSS, background, rest.className)}>
      {children}
      {shadowBottom && (
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '100px',
            background: 'linear-gradient(180deg, rgba(5, 5, 10, 0) 0%, rgba(5, 5, 10, 1) 100%)',
            pointerEvents: 'none'
          }}
        />
      )}
    </div>
  );
};
