interface CaptionProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: string;
  variant?: 'normal' | 'bold';
  children?: string | number;
  styles?: string;
  fontSize?: string;
  id?: string;
}

export const Caption = ({
  color = 'text-white',
  variant = 'normal',
  children,
  styles = '',
  fontSize = 'text-[13px]',
  ...rest
}: CaptionProps) => {
  let cssClasses = `${fontSize} font-normal font-['Inter Tight'] tracking-tight`;

  switch (variant) {
    case 'bold':
      cssClasses = `${fontSize} font-semibold font-['Inter Tight'] tracking-tight`;
      break;
  }

  return (
    <div className={`${cssClasses} ${color} ${styles}`} {...rest}>
      {children}
    </div>
  );
};
