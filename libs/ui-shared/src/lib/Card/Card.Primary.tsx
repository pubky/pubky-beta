import { twMerge } from 'tailwind-merge';
import { Typography } from '../../index';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  text?: string;
  children?: React.ReactNode;
  className?: string;
}

export const Primary = ({ title, text, children, ...rest }: CardProps) => {
  return (
    <div
      {...rest}
      className={twMerge(
        `w-full z-10 p-8 bg-gradient-to-b from-[#07040a] to-[#1b1820] opacity-90 rounded-2xl shadow border border-white border-opacity-20 flex-col justify-start gap-12 inline-flex`,
        rest.className
      )}
    >
      <div className={`flex-col justify-start ${text && 'gap-6'} inline-flex`}>
        {title && (
          <Typography.Body variant="large-bold">{title}</Typography.Body>
        )}
        {text && (
          <Typography.Body
            className="text-white text-opacity-80"
            variant="medium-light"
          >
            {text}
          </Typography.Body>
        )}
        {children}
      </div>
    </div>
  );
};
