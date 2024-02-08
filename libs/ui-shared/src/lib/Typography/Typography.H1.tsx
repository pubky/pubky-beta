type H1Props = {
  color?: string;
  children: string;
  styles?: string;
  id?: string;
};

export const H1 = ({
  color = 'text-white',
  children,
  styles,
  ...props
}: H1Props) => {
  return (
    <h1
      className={`text-[38px] font-semibold font-['Inter Tight'] tracking-wide ${color} ${styles}`}
      {...props}
    >
      {children}
    </h1>
  );
};
