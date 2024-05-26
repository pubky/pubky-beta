// import { useRouter } from 'next/navigation';
import { twMerge } from 'tailwind-merge';

interface RootProps extends React.HTMLAttributes<HTMLDivElement> {
  href: string;
  children?: React.ReactNode;
}

export const Root = ({ href, children, ...rest }: RootProps) => {
  // const router = useRouter();
  return (
    <div
      // onClick={() => router.push(href)}
      className={twMerge(`flex-col gap-6 flex`, rest.className)}
      {...rest}
    >
      {children}
    </div>
  );
};
