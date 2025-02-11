import { twMerge } from 'tailwind-merge';

interface LinksStoreAppProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const LinksStoreApp = ({ ...rest }: LinksStoreAppProps) => {
  const baseCSS =
    'relative sm:-ml-2 mt-4 self-stretch items-center justify-center sm:justify-start flex';
  return (
    <div {...rest} className={twMerge(baseCSS, rest.className)}>
      <img
        className="w-full h-[65px] sm:w-[112px] sm:h-[45px]"
        src="/images/webp/apple-store.webp"
      />
      <img
        className="w-full h-[65px] sm:w-[112px] sm:h-[45px]"
        src="/images/webp/google-play.webp"
      />
    </div>
  );
};
