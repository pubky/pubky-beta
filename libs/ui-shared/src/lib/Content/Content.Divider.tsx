import { twMerge } from 'tailwind-merge';

interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}
export const Divider = ({ ...rest }: DividerProps) => {
  const baseCSS = 'w-full h-px bg-white bg-opacity-10 my-6';
  return <div {...rest} className={twMerge(baseCSS, rest.className)} />;
};
