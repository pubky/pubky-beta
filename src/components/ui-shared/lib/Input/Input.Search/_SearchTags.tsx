import { twMerge } from 'tailwind-merge';

interface SearchTagsProps extends React.InputHTMLAttributes<HTMLInputElement> {
  tags?: string[];
  ref?: React.RefObject<HTMLDivElement>;
}

export const SearchTags = ({ tags, ref, ...rest }: SearchTagsProps) => {
  const baseCSS = 'absolute top-[20%] left-6 flex items-center no-scrollbar';

  return (
    <div
      {...rest}
      ref={ref}
      style={{ maxWidth: 'calc(100% - 20px)', overflowX: 'auto' }}
      className={twMerge(baseCSS, rest.className)}
    >
      {rest.children}
    </div>
  );
};
