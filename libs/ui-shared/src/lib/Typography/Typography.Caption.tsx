import { twMerge } from 'tailwind-merge';

interface CaptionProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'normal' | 'bold';
  children?: React.ReactNode;
}

export const Caption = ({
  variant = 'normal',
  children,
  ...rest
}: CaptionProps) => {
  let cssClasses;

  switch (variant) {
    case 'bold':
      cssClasses = `text-[13px] font-semibold font-['Inter Tight'] tracking-tight`;
      break;
  }

  return (
    <div
      {...rest}
      className={twMerge(
        `text-[13px] font-normal font-['Inter Tight'] tracking-tight`,
        cssClasses,
        rest.className
      )}
    >
      {children}
    </div>
  );
};
