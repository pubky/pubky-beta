import { twMerge } from 'tailwind-merge';
import { Typography } from '../Typography';

interface TextAreaProps extends React.HTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  children?: string;
}

export const TextArea = ({ label, children = '', ...rest }: TextAreaProps) => {
  const baseCSS = `w-full h-[70px] p-6 bg-white bg-opacity-10 rounded-lg shadow-[0_4px_8px_0_rgba(0,0,0,0.32)_inset] border border-white border-opacity-10 flex-col justify-start items-start inline-flex outline-none text-white text-opacity-80 placeholder:text-white placeholder:text-opacity-30 text-[17px] font-normal font-['Inter Tight'] leading-snug tracking-wide resize-none`;

  return (
    <>
      {label && (
        <Typography.Label className="text-white text-opacity-30 mb-2">
          {label}
        </Typography.Label>
      )}
      <textarea {...rest} className={twMerge(baseCSS, rest.className)}>
        {children}
      </textarea>
    </>
  );
};
