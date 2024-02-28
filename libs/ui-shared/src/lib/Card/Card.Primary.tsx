import { twMerge } from 'tailwind-merge';
import { Typography } from '../../index';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  text?: string;
  background?: string;
  borderRadius?: string;
  children?: React.ReactNode;
  className?: string;
}

export const Primary = ({
  title,
  text,
  background = 'bg-gradient-to-b from-[#07040a] to-[#1b1820] opacity-90',
  borderRadius = 'rounded-2xl',
  children,
  ...rest
}: CardProps) => {
  const baseCSS = `w-full z-10 p-8 shadow border border-white border-opacity-20 flex-col justify-between inline-flex`;

  return (
    <div
      {...rest}
      className={twMerge(baseCSS, background, borderRadius, rest.className)}
    >
      {(title || text) && (
        <div
          className={twMerge(
            `flex-col justify-start inline-flex`,
            text && 'gap-6'
          )}
        >
          <Typography.Body variant="large-bold">{title}</Typography.Body>
          <Typography.Body className="text-opacity-80" variant="medium-light">
            {text}
          </Typography.Body>
        </div>
      )}
      {children}
    </div>
  );
};
