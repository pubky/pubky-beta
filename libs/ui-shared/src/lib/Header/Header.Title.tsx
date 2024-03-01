import { twMerge } from 'tailwind-merge';
import { Typography } from '../Typography';

interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
}

export const Title = ({ title, ...rest }: HeaderProps) => {
  const responsiveCSS = title !== 'Onboarding' && 'hidden md:block';
  return (
    <div
      {...rest}
      className={twMerge('grow pr-6', responsiveCSS, rest.className)}
    >
      <Typography.PageTitle className="text-lg mt-2 sm:text-3xl sm:mt-0 text-opacity-50">
        {title}
      </Typography.PageTitle>
    </div>
  );
};
