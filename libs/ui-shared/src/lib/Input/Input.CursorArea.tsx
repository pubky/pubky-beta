import { twMerge } from 'tailwind-merge';

interface CursorAreaProps extends React.HTMLAttributes<HTMLTextAreaElement> {
  children?: string;
}

export const CursorArea = ({ children, ...rest }: CursorAreaProps) => {
  const baseCSS = `w-full h-24 bg-transparent rounded-[5px] outline-none text-white text-[17px] placeholder:text-white placeholder:text-opacity-30 font-normal font-['Inter Tight'] leading-snug tracking-wide resize-none`;

  return (
    <textarea
      {...rest}
      className={twMerge(baseCSS, rest.className)}
      value={children}
    />
  );
};
