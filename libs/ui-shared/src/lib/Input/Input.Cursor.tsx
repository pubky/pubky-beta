import { twMerge } from 'tailwind-merge';

interface CursorProps extends React.HTMLAttributes<HTMLInputElement> {
  children?: string;
}

export const Cursor = ({ children, ...rest }: CursorProps) => {
  const baseCSS = `w-full h-24 bg-transparent rounded-[5px] outline-none text-white text-opacity-80 text-[17px] font-normal font-['Inter Tight'] leading-snug tracking-wide`;

  return (
    <input
      {...rest}
      className={twMerge(baseCSS, rest.className)}
      value={children}
    />
  );
};
