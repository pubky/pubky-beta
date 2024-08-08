import Image from 'next/image';

import { Content, Card } from '@social/ui-shared';

export default function SignIn() {
  return (
    <Card.Primary
      title="Sign in with Bitkit"
      text="Use Bitkit or another Pubky Core powered wallet. Scan the QR to sign in."
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
