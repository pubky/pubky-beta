import { Typography } from '../Typography';

type InputFieldProps = {
  value?: string;
  placeHolder?: string;
  label?: string;
  width?: string;
  height?: string;
  styles?: string;
  multiline?: boolean;
  className?: string;
  icon?: React.ReactNode;
};

export const InputField = ({
  value,
  placeHolder,
  label,
  width = 'w-full',
  height = 'h-[70px]',
  multiline,
  styles,
  icon,
  ...props
}: InputFieldProps) => {
  const cssStyle = `${width} ${height} p-6 bg-white bg-opacity-10 rounded-lg shadow-[0_4px_8px_0_rgba(0,0,0,0.32)_inset] border border-white border-opacity-10 flex-col justify-start items-start inline-flex outline-none`;
  const inputTextStyle = `text-white text-opacity-80 placeholder:text-white placeholder:text-opacity-30 text-[17px] font-normal font-['Inter Tight'] leading-snug tracking-wide`;

  return (
    <>
      {label && (
        <Typography.Label
          color="text-white text-opacity-30"
          styles="uppercase mb-2"
        >
          {label}
        </Typography.Label>
      )}
      {multiline ? (
        <textarea
          className={`${cssStyle} ${inputTextStyle} resize-none ${styles}`}
          placeholder={placeHolder}
          value={value}
          {...props}
        />
      ) : (
        <div className="relative">
          <input
            className={`${cssStyle} ${inputTextStyle} ${styles}`}
            placeholder={placeHolder}
            value={value}
            {...props}
          />
          {icon && (
            <div className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white">
              {icon}
            </div>
          )}
        </div>
      )}
    </>
  );
};
