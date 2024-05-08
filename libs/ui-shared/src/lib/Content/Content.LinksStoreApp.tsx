import Image from 'next/image';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';

interface LinksStoreAppProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const LinksStoreApp = ({ ...rest }: LinksStoreAppProps) => {
  const baseCSS = 'flex gap-1 mt-6';
  return (
    <div {...rest} className={twMerge(baseCSS, rest.className)}>
      <Link href="https://www.bitkit.to/" target="_blank">
        <Image width={122} height={36} alt="bitkit" src="/images/bitkit.png" />
      </Link>
      <Link href="https://testflight.apple.com/join/lGXhnwcC" target="_blank">
        <Image
          width={100}
          height={44}
          alt="apple-store"
          src="/images/apple-store.png"
        />
      </Link>
      <Link
        href="https://play.google.com/apps/testing/to.synonym.bitkit.wallet"
        target="_blank"
      >
        <Image
          width={100}
          height={44}
          alt="google-play"
          src="/images/google-play.png"
        />
      </Link>
    </div>
  );
};
