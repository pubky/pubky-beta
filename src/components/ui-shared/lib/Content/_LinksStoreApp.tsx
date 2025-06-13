import Link from 'next/link';
import { twMerge } from 'tailwind-merge';

interface LinksStoreAppProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const LinksStoreApp = ({ ...rest }: LinksStoreAppProps) => {
  const baseCSS = 'relative sm:-ml-2 mt-4 self-stretch items-center justify-center sm:justify-start flex';
  return (
    <div {...rest} className={twMerge(baseCSS, rest.className)}>
      <Link target="_blank" href="https://apps.apple.com/us/app/pubky-ring/id6739356756">
        <img
          className="w-full h-[65px] sm:w-[112px] sm:h-[45px] object-contain"
          src="/images/webp/apple-store.webp"
          alt="Apple Store"
        />
      </Link>
      <Link target="_blank" href="https://play.google.com/apps/testing/to.pubkyring">
        <img
          className="w-full h-[65px] sm:w-[112px] sm:h-[45px] object-contain"
          src="/images/webp/google-play.webp"
          alt="Google Play"
        />
      </Link>
    </div>
  );
};
