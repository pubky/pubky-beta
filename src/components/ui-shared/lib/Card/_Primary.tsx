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
  imageTitle?: React.ReactNode;
}

export const Primary = ({
  title,
  text,
  background = 'bg-white bg-opacity-10',
  borderRadius = 'rounded-lg',
  children,
  refCard,
  imageTitle,
  ...rest
}: CardProps) => {
  const baseCSS = `w-full p-8 shadow flex-col justify-between inline-flex`;

  return (
    <div ref={refCard} {...rest} className={twMerge(baseCSS, background, borderRadius, rest.className)}>
      {(title || text) && (
        <div className={twMerge(`flex-col justify-start inline-flex`, text && 'gap-3')}>
          <div className="flex gap-1 items-center">
            <Typography.Body className="tracking-normal" variant="large-bold">
              {title}
            </Typography.Body>
            {imageTitle}
          </div>
          <Typography.Body className="text-opacity-80 leading-snug" variant="medium-light">
            {text}
          </Typography.Body>
        </div>
      )}
      {children}
    </div>
  );
};
