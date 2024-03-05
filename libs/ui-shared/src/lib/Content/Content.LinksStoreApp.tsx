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
  const baseCSS = 'flex-col justify-start items-start gap-6 inline-flex';
  return (
    <div {...rest} className={twMerge(baseCSS, rest.className)}>
      <Link
        className="w-full"
        href="https://testflight.apple.com/join/lGXhnwcC"
      >
        <Card.Primary className="p-6 flex-row xl:p-8">
          <Image width={70} height={25} src={bitkit} alt="bitkit" />
          <Image
            className="scale-50 md:scale-75 lg:scale-50 xl:scale-100"
            width={116}
            height={24}
            src={iphone}
            alt="iphone"
          />
        </Card.Primary>
      </Link>
      <Link
        className="w-full"
        href="https://play.google.com/apps/testing/to.synonym.bitkit.wallet"
      >
        <Card.Primary className="p-6 flex-row xl:p-8">
          <Image width={70} height={25} src={bitkit} alt="bitkit" />
          <Image
            className="scale-50 md:scale-75 lg:scale-50 xl:scale-100"
            width={157}
            height={24}
            src={android}
            alt="android"
          />
        </Card.Primary>
      </Link>
    </div>
  );
};
