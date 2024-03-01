import Image from 'next/image';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';
import { Card } from '../Card';

interface LinksStoreAppProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const LinksStoreApp = ({ ...rest }: LinksStoreAppProps) => {
  const bitkit = '/images/bitkit.png';
  const android = '/images/android.png';
  const iphone = '/images/iphone.png';
  const baseCSS =
    'my-6 flex-col justify-start items-start gap-6 inline-flex xl:my-0';
  return (
    <div {...rest} className={twMerge(baseCSS, rest.className)}>
      <Link href="https://testflight.apple.com/join/lGXhnwcC">
        <Card.Primary className="w-[220px] flex-col gap-2 sm:w-80 lg:w-64 xl:w-80 lg:gap-4 sm:flex-row sm:gap-0">
          <Image width={70} height={25} src={bitkit} alt="bitkit" />
          <Image width={116} height={24} src={iphone} alt="iphone" />
        </Card.Primary>
      </Link>
      <Link href="https://play.google.com/apps/testing/to.synonym.bitkit.wallet">
        <Card.Primary className="w-[220px] flex-col gap-2 sm:w-80 lg:w-64 xl:w-80 lg:gap-4 sm:flex-row sm:gap-0">
          <Image width={70} height={25} src={bitkit} alt="bitkit" />
          <Image width={116} height={24} src={android} alt="android" />
        </Card.Primary>
      </Link>
    </div>
  );
};
