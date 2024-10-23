import Image from 'next/image';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';

interface LinksStoreAppProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const LinksStoreApp = ({ ...rest }: LinksStoreAppProps) => {
  const baseCSS = 'flex mt-4';
  return (
    <div {...rest} className={twMerge(baseCSS, rest.className)}>
      {/**<Link href="https://www.bitkit.to/" target="_blank">
        <Image width={122} height={36} alt="bitkit" src="/images/bitkit.png" />
      </Link>*/}
      <Link
        href="https://apps.apple.com/us/app/bitkit-wallet/id6502440655"
        target="_blank"
      >
        <Image
          width={160}
          height={94}
          alt="apple-store"
          src="/images/apple-store.png"
        />
      </Link>
      <Link
        href="https://play.google.com/store/apps/details?id=to.bitkit"
        target="_blank"
      >
        <Image
          width={160}
          height={94}
          alt="google-play"
          src="/images/google-play.png"
        />
      </Link>
    </div>
  );
};
