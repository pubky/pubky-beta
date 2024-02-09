type DisplayProps = {
  color?: string;
  children: string;
  styles?: string;
  id?: string;
};

export const Display = ({
  color = 'text-white',
  children,
  styles,
  ...props
}: DisplayProps) => {
  return (
    <h1
      className={`text-[100px] font-bold font-['Inter Tight'] ${color} ${styles}`}
      {...props}
    >
      {children}
    </h1>
  );
};
