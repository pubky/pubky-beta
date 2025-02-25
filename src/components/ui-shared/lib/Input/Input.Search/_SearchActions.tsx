import { twMerge } from 'tailwind-merge';

interface SearchActionsProps extends React.HTMLAttributes<HTMLDivElement> {}

export const SearchActions = ({ ...rest }: SearchActionsProps) => {
  const baseCSS = 'absolute flex top-1/4 right-4 gap-2';

  return (
    <div {...rest} className={twMerge(baseCSS, rest.className)}>
      {rest.children}
    </div>
  );
};
