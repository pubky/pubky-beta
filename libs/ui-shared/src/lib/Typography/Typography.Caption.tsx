type CaptionProps = {
  color?: string;
  variant?: 'normal' | 'bold';
  children: string;
  styles?: string;
  id?: string;
};

export const Caption = ({
  color = 'text-white',
  variant = 'normal',
  children,
  styles = '',
  ...props
}: CaptionProps) => {
  let cssClasses = `text-[13px] font-normal font-['Inter Tight'] tracking-tight`;

  switch (variant) {
    case 'bold':
      cssClasses =
        "text-[13px] font-semibold font-['Inter Tight'] tracking-tight";
      break;
  }

  return (
    <p className={`${cssClasses} ${color} ${styles}`} {...props}>
      {children}
    </p>
  );
};
