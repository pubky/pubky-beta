type PageTitleProps = {
  color?: string;
  children: string;
  styles?: string;
  id?: string;
};

export const PageTitle = ({
  color = 'text-white',
  children,
  styles = '',
  ...props
}: PageTitleProps) => {
  return (
    <h2
      className={`text-3xl font-light font-['Inter Tight'] ${color} ${styles}`}
      {...props}
    >
      {children}
    </h2>
  );
};
