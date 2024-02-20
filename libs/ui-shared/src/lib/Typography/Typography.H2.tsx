interface H2Props extends React.HTMLAttributes<HTMLHeadingElement> {
  color?: string;
  variant?: 'normal' | 'light';
  children: string;
  styles?: string;
  id?: string;
}

export const H2 = ({
  color = 'text-white',
  variant = 'normal',
  children,
  styles = '',
  ...rest
}: H2Props) => {
  let cssClasses = `text-2xl font-semibold font-['Inter Tight'] tracking-wide`;

  switch (variant) {
    case 'light':
      cssClasses = "text-2xl font-normal font-['Inter Tight'] tracking-wide";
      break;
  }

  return (
    <h2 className={`${cssClasses} ${color} ${styles}`} {...rest}>
      {children}
    </h2>
  );
};
