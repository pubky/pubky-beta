import { twMerge } from 'tailwind-merge';

interface H2Props extends React.HTMLAttributes<HTMLHeadingElement> {
  variant?: 'normal' | 'light';
  children: string | React.ReactNode;
}

export const H2 = ({ variant = 'normal', children, ...rest }: H2Props) => {
  let cssClasses;

  switch (variant) {
    case 'light':
      cssClasses = 'text-2xl font-normal font-InterTight tracking-wide';
      break;
  }

  return (
    <h2
      {...rest}
      className={twMerge(`text-2xl font-semibold font-InterTight tracking-wide text-white`, cssClasses, rest.className)}
    >
      {children}
    </h2>
  );
};
