import { Typography } from '../Typography';

import { twMerge } from 'tailwind-merge';

interface TitleProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
}

export const Title = ({ title, subtitle, ...rest }: TitleProps) => {
  const baseCSS = 'mb-6 flex-col justify-start items-start flex';

  return (
    <div {...rest} className={twMerge(baseCSS, rest.className)}>
      <Typography.H1>{title}</Typography.H1>
      {subtitle && (
        <Typography.Body variant="medium" className="text-opacity-80">
          {subtitle}
        </Typography.Body>
      )}
    </div>
  );
};
