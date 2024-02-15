type GridProps = {
  children: React.ReactNode;
  height?: string;
  width?: string;
  className?: string;
  styles?: string;
};

export const Grid = ({
  children,
  width,
  height,
  styles,
  ...props
}: GridProps) => {
  return (
    <div
      className={`${width} ${height} max-w-[1200px] justify-start items-start my-0 mx-auto ${styles}`}
      {...props}
    >
      {children}
    </div>
  );
};