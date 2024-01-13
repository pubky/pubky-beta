interface OnBoardingTitleProps {
  color?: string;
  children: string;
  styles?: string;
  id?: string;
}

export const OnBoardingTitle = ({
  color = 'text-white',
  children,
  styles,
  ...props
}: OnBoardingTitleProps) => {
  const textColor = `${color}`;

  return (
    <h1
      className={`font-inter-tight text-[100px] font-bold leading-[120px] tracking-tighter ${textColor} ${styles}`}
      {...props}
    >
      {children}
    </h1>
  );
};
