interface PageTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  color?: string;
  children: string;
  styles?: string;
  id?: string;
}

export const PageTitle = ({
  color = 'text-white',
  children,
  styles = '',
  ...rest
}: PageTitleProps) => {
  return (
    <h2
      className={`text-3xl font-light font-['Inter Tight'] ${color} ${styles}`}
      {...rest}
    >
      {children}
    </h2>
  );
};
