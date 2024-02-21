import { twMerge } from 'tailwind-merge';

interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}
export const Primary = ({ ...rest }: DividerProps) => {
  const baseCSS = 'border-t border border-white opacity-[0.1] my-6';
  return <div {...rest} className={twMerge(baseCSS, rest.className)} />;
};
