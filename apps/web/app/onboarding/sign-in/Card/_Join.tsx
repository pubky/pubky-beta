import Image from 'next/image';

import { Content, Card, Typography } from '@social/ui-shared';
import Link from 'next/link';

export default function Join() {
  return (
    <Card.Primary
      title="Join with"
      text="Scan the QR with Bitkit or any other Pubky Core powered wallet."
      imageTitle={
        <Link href="https://bitkit.to" target="_blank">
          <Image
            width={102}
            height={36}
            alt="bitkit"
            src="/images/bitkit.png"
          />
        </Link>
      }
      className="w-full col-span-2"
    >
      <div className="relative">
        <Image
          width={320}
          height={320}
          className="rounded-lg mt-6"
          alt="qr"
          src="/images/qr.png"
        />
        <div className="w-full inset-0 flex items-center justify-right left-8 absolute">
          <Typography.H2 className="text-center w-full px-4 py-3 bg-[#2a2a2f] font-extrabold rounded-tl-3xl rounded-bl-3xl">
            COMING SOON
          </Typography.H2>
        </div>
      </div>
      <Content.LinksStoreApp />
    </Card.Primary>
  );
}
