import { twMerge } from 'tailwind-merge';
import { Typography } from '../../index';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  text?: string;
  background?: string;
  borderRadius?: string;
  children?: React.ReactNode;
  className?: string;
  refCard?: React.RefObject<HTMLDivElement>;
}

export const Primary = ({
  title,
  text,
  background = 'bg-white bg-opacity-10',
  borderRadius = 'rounded-2xl',
  children,
  refCard,
  ...rest
}: CardProps) => {
  const baseCSS = `w-full p-8 shadow flex-col justify-between inline-flex`;

  return (
    <div
      ref={refCard}
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
