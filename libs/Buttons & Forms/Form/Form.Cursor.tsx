type CursorProps = {
  width?: string;
  height?: string;
  value?: string;
  placeHolder?: string;
  styles?: string;
  fontSize?: string;
  fontWeight?: string;
  color?: string;
  className?: string;
};

export const Cursor = ({
  width = 'w-full',
  height = 'h-24',
  value,
  placeHolder,
  styles,
  fontSize = 'text-[17px]',
  fontWeight = 'font-normal',
  color = 'text-white text-opacity-80',
  ...props
}: CursorProps) => {
  const cssStyle = `${width} ${height} bg-transparent rounded-[5px] outline-none`;
  const inputTextStyle = `${color} ${fontSize} ${fontWeight} font-['Inter Tight'] leading-snug tracking-wide`;

  return (
    <input
      placeholder={placeHolder}
      className={`${cssStyle} ${inputTextStyle} ${styles}`}
      value={value}
      {...props}
    />
  );
};
