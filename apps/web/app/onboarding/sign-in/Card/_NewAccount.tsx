import Image from 'next/image';
import Link from 'next/link';
import { Card, Button, Icon } from '@social/ui-shared';

export default function NewAccount() {
  return (
    <Card.Primary
      title="New Pubky"
      text="Another option is to create a new account and profile on Pubky itself (less secure)."
    >
      <Image width={320} height={236} alt="visual" src="/images/identity.png" />
      <Link
        href="/onboarding/sign-up"
        className="mt-4 lg:mt-0"
        id="onboarding-sign-up-link"
      >
        <Button.Large icon={<Icon.UserRectangle />}>New pubky</Button.Large>
      </Link>
    </Card.Primary>
  );
}
