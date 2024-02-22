import Image from 'next/image';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';

interface LinksStoreAppProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const LinksStoreApp = ({ ...rest }: LinksStoreAppProps) => {
  const bitkit = '/images/bitkit.png';
  const android = '/images/android.png';
  const iphone = '/images/iphone.png';
  const baseCSS = `w-80 h-[89px] p-8 bg-gradient-to-b from-[#07040a] to-[#1b1820] rounded-2xl shadow border border-white border-opacity-20 justify-between items-start inline-flex`;
  return (
    <div className="flex-col justify-start items-start gap-6 inline-flex">
      <Link href="https://testflight.apple.com/join/lGXhnwcC">
        <div {...rest} className={twMerge(baseCSS, rest.className)}>
          <Image width={70} height={25} src={bitkit} alt="bitkit" />
          <Image
            width={116}
            height={24}
            src={iphone}
            alt="iphone"
            className="w-[116.06px] h-6"
          />
        </div>
      </Link>
      <Link href="https://play.google.com/apps/testing/to.synonym.bitkit.wallet">
        <div {...rest} className={twMerge(baseCSS, rest.className)}>
          <Image width={70} height={25} src={bitkit} alt="bitkit" />
          <Image width={157} height={24} src={android} alt="android" />
        </div>
      </Link>
    </div>
  );
};
