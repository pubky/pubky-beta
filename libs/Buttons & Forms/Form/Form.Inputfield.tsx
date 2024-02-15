import { Typography } from '../Typography';

type InputfieldProps = {
  value?: string;
  placeHolder?: string;
  label?: string;
  width?: string;
  height?: string;
  styles?: string;
  className?: string;
};

export const Inputfield = ({
  value,
  placeHolder,
  label,
  width = 'w-96',
  height = 'h-[70px]',
  styles,
  ...props
}: InputfieldProps) => {
  const cssStyle = `${width} ${height} p-6 bg-white bg-opacity-10 rounded-lg shadow-inner border border-white border-opacity-10 flex-col justify-start items-start inline-flex outline-none`;
  const inputTextStyle = `text-white text-opacity-80 placeholder:text-white placeholder:text-opacity-30 text-[17px] font-normal font-['Inter Tight'] leading-snug tracking-wide`;

  return (
    <div className="flex-col justify-start items-start gap-2 inline-flex">
      <Typography.Caption color="text-white text-opacity-30" styles="uppercase">
        {label}
      </Typography.Caption>
      <input
        className={`${cssStyle} ${inputTextStyle} ${styles}`}
        placeholder={placeHolder}
        value={value}
        {...props}
      />
    </div>
  );
};
