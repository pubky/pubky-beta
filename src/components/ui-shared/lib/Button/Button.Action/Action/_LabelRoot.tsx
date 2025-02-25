import { twMerge } from 'tailwind-merge';

interface ActionButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const LabelRoot = ({ children, ...rest }: ActionButtonProps) => {
  const baseCSS = `flex absolute text-center justify-center items-center`;

  return <div className={twMerge(baseCSS, rest.className)}>{children}</div>;
};
