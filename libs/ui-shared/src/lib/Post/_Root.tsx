// import { useRouter } from 'next/navigation';
import { twMerge } from 'tailwind-merge';

interface RootProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const Root = ({ children, ...rest }: RootProps) => {
  return (
    <div className={twMerge(`flex-col gap-6 flex`, rest.className)} {...rest}>
      {children}
    </div>
  );
};
