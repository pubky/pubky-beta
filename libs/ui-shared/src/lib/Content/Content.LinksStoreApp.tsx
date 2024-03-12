import Image from 'next/image';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';
import { Card } from '../Card';
import { Icon } from '../Icon';

interface LinksStoreAppProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const LinksStoreApp = ({ ...rest }: LinksStoreAppProps) => {
  const bitkit = '/images/bitkit.png';
  const baseCSS = 'flex-col justify-start items-start gap-6 inline-flex';
  return (
    <div {...rest} className={twMerge(baseCSS, rest.className)}>
      <Link
        className="w-full"
        href="https://testflight.apple.com/join/lGXhnwcC"
      >
        <Card.Primary className="p-6 flex-row xl:p-8">
          <Image width={70} height={25} src={bitkit} alt="bitkit" />
          <div className="flex flex-row justify-center w-[116px] sm:w-[65px] md:w-[96px] lg:w-[65px] xl:w-[116px] ">
            <Icon.Iphone />
          </div>
        </Card.Primary>
      </Link>
      <Link
        className="w-full"
        href="https://play.google.com/apps/testing/to.synonym.bitkit.wallet"
      >
        <Card.Primary className="p-6 flex-row xl:p-8">
          <Image width={70} height={25} src={bitkit} alt="bitkit" />
          <div className="flex flex-row justify-center w-[156px] sm:w-[80px] md:w-[126px] lg:w-[80px] xl:w-[156px] ">
            <Icon.Android />
          </div>
        </Card.Primary>
      </Link>
    </div>
  );
};
