import { twMerge } from 'tailwind-merge';

interface SearchProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Search = ({ ...rest }: SearchProps) => {
  const baseCSS = `relative w-full`;

  return (
    <div {...rest} className={twMerge(baseCSS, rest.className)}>
      {rest.children}
    </div>
  );
};
