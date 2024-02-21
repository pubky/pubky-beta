import { twMerge } from 'tailwind-merge';

interface SearchTagsProps extends React.InputHTMLAttributes<HTMLInputElement> {
  tags?: string[];
}

export const SearchTags = ({ tags, ...rest }: SearchTagsProps) => {
  const baseCSS = 'absolute top-[20%] left-6 flex items-center gap-2';

  return (
    <div {...rest} className={twMerge(baseCSS, rest.className)}>
      {rest.children}
    </div>
  );
};
