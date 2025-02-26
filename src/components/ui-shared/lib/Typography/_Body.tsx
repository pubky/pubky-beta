import { twMerge } from 'tailwind-merge';

interface BodyProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: 'large' | 'large-bold' | 'medium' | 'medium-bold' | 'medium-light' | 'small' | 'small-bold' | 'small-light';
  children: React.ReactNode;
}

export const Body = ({ variant = 'large', children, ...rest }: BodyProps) => {
  let cssClasses;

  switch (variant) {
    case 'large-bold':
      cssClasses = 'text-2xl font-semibold font-InterTight tracking-wide';
      break;
    case 'large':
      cssClasses = 'text-2xl font-normal font-InterTight tracking-wide';
      break;
    case 'medium':
      cssClasses = 'text-[17px] font-normal font-InterTight tracking-wide';
      break;
    case 'medium-bold':
      cssClasses = 'text-[17px] font-semibold font-InterTight tracking-wide';
      break;
    case 'medium-light':
      cssClasses = 'text-[17px] font-light font-InterTight tracking-wide';
      break;
    case 'small':
      cssClasses = 'text-[15px] font-normal font-InterTight tracking-tight';
      break;
    case 'small-bold':
      cssClasses = 'text-[15px] font-semibold font-InterTight tracking-tight';
      break;
    case 'small-light':
      cssClasses = 'text-[15px] font-light font-InterTight tracking-tight';
      break;
  }

  return (
    <div
      {...rest}
      className={twMerge(`text-2xl font-normal font-InterTight tracking-wide text-white`, cssClasses, rest.className)}
    >
      {children}
    </div>
  );
};
