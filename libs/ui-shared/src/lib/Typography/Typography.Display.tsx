interface DisplayProps extends React.HTMLAttributes<HTMLHeadingElement> {
  color?: string;
  children: string;
  styles?: string;
  id?: string;
}

export const Display = ({
  color = 'text-white',
  children,
  styles = '',
  ...rest
}: DisplayProps) => {
  return (
    <h1
      className={`text-[100px] font-bold font-['Inter Tight'] ${color} ${styles}`}
      {...rest}
    >
      {children}
    </h1>
  );
};
