import Image from 'next/image';

import { Content, Card } from '@social/ui-shared';

export default function Join() {
  return (
    <Card.Primary
      title="Join with Bitkit"
      text="Have Bitkit or another Pubky Core powered wallet? Scan this QR to sign up."
    >
      <Image
        width={320}
        height={320}
        className="mt-6"
        alt="qr"
        src="/images/qr.png"
      />
      <Content.LinksStoreApp />
    </Card.Primary>
  );
}
