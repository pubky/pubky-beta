interface LabelProps extends React.HTMLAttributes<HTMLParagraphElement> {
  color?: string;
  children: string;
  styles?: string;
  id?: string;
}

export const Label = ({
  color = 'text-white',
  children,
  styles = '',
  ...rest
}: LabelProps) => {
  return (
    <p
      className={`text-[13px] font-semibold font-['Inter Tight'] uppercase tracking-wide ${color} ${styles}`}
      {...rest}
    >
      {children}
    </p>
  );
};
