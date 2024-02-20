import { twMerge } from 'tailwind-merge';

interface CursorProps extends React.HTMLAttributes<HTMLInputElement> {
  value?: string;
  placeHolder?: string;
}

export const Cursor = ({ value, placeHolder, ...rest }: CursorProps) => {
  return (
    <input
      {...rest}
      placeholder={placeHolder}
      className={twMerge(
        `w-full h-24 bg-transparent rounded-[5px] outline-none text-white text-opacity-80 text-[17px] font-normal font-['Inter Tight'] leading-snug tracking-wide`,
        rest.className
      )}
      value={value}
    />
  );
};
