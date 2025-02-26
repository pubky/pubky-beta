import { twMerge } from 'tailwind-merge';

interface CaptionProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'normal' | 'bold';
  children?: React.ReactNode;
}

export const Caption = ({ variant = 'normal', children, ...rest }: CaptionProps) => {
  let cssClasses = 'text-[13px] text-white font-normal font-InterTight tracking-tight';

  switch (variant) {
    case 'bold':
      cssClasses = `text-[13px] text-white font-semibold font-InterTight tracking-tight`;
      break;
  }

  return (
    <div {...rest} className={twMerge(cssClasses, rest.className)}>
      {children}
    </div>
  );
};
