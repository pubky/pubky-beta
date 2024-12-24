import Image from 'next/image';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';

interface LinksStoreAppProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const LinksStoreApp = ({ ...rest }: LinksStoreAppProps) => {
  const baseCSS = '-ml-2 mt-4 self-stretch items-center inline-flex';
  return (
    <div {...rest} className={twMerge(baseCSS, rest.className)}>
      {/**<Link href="https://www.bitkit.to/" target="_blank">
      <Image width={122} height={36} alt="bitkit" src="/images/webp/bitkit.webp" />
    </Link>*/}
      <img className="w-[112px] h-[45px]" src="/images/webp/apple-store.webp" />
      <img className="w-[112px] h-[45px]" src="/images/webp/google-play.webp" />
    </div>
  );
};
