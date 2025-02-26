import { twMerge } from 'tailwind-merge';

interface RootProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export default function Root({ children, ...rest }: RootProps) {
  return (
    <div className="flex-col gap-6 flex">
      <div className="z-auto">
        <div
          {...rest}
          id="profile-list-root"
          className={twMerge(`flex-col justify-start gap-4 items-start flex`, rest.className)}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
