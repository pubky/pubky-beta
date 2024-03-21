import { twMerge } from 'tailwind-merge';

interface TextAreaProps extends React.HTMLAttributes<HTMLTextAreaElement> {}

export const TextArea = ({ ...rest }: TextAreaProps) => {
  const baseCSS = `scrollbar-thin scrollbar-webkit w-full h-[70px] bg-transparent flex-col justify-start items-start inline-flex outline-none text-white text-opacity-80 placeholder:text-white placeholder:text-opacity-30 text-[17px] font-normal font-InterTight leading-snug tracking-wide resize-none`;

  return <textarea {...rest} className={twMerge(baseCSS, rest.className)} />;
};
