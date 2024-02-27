import { Typography } from '@social/ui-shared';
import { twMerge } from 'tailwind-merge';

interface ContentProps extends React.HTMLAttributes<HTMLDivElement> {
  text?: string;
  children?: React.ReactNode;
}
export const Content = ({ children, text, ...rest }: ContentProps) => {
  return (
    <>
      <Typography.Body
        {...rest}
        className={twMerge(`text-opacity-80`, rest.className)}
        variant="medium"
      >
        {text}
      </Typography.Body>
      {children}
    </>
  );
};
