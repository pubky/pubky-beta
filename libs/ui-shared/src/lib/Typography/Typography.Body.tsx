type BodyProps = {
  color?: string;
  variant?:
    | 'large'
    | 'large-bold'
    | 'medium'
    | 'medium-bold'
    | 'medium-light'
    | 'small'
    | 'small-bold'
    | 'small-light';
  children: string;
  styles?: string;
  id?: string;
};

export const Body = ({
  color = 'text-white',
  variant = 'large',
  children,
  styles = '',
  ...props
}: BodyProps) => {
  let cssClasses = `text-2xl font-normal font-['Inter Tight'] tracking-wide`;

  switch (variant) {
    case 'large-bold':
      cssClasses = "text-2xl font-semibold font-['Inter Tight'] tracking-wide";
      break;
    case 'medium':
      cssClasses = "text-[17px] font-normal font-['Inter Tight'] tracking-wide";
      break;
    case 'medium-bold':
      cssClasses =
        "text-[17px] font-semibold font-['Inter Tight'] tracking-wide";
      break;
    case 'medium-light':
      cssClasses = "text-[17px] font-light font-['Inter Tight'] tracking-wide";
      break;
    case 'small':
      cssClasses =
        "text-[15px] font-normal font-['Inter Tight'] tracking-tight";
      break;
    case 'small-bold':
      cssClasses =
        "text-[15px] font-semibold font-['Inter Tight'] tracking-tight";
      break;
    case 'small-light':
      cssClasses = "text-[15px] font-light font-['Inter Tight'] tracking-tight";
      break;
  }

  return (
    <p className={`${cssClasses} ${color} ${styles}`} {...props}>
      {children}
    </p>
  );
};
