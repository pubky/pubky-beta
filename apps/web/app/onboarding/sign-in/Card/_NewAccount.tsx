import Link from 'next/link';
import { Card, Button, Icon } from '@social/ui-shared';

export default function NewAccount() {
  return (
    <Card.Primary
      title="Create new Pubky"
      text="Another option is to create a new account and profile on Pubky itself."
      className="w-full col-span-3"
    >
      <div className="flex justify-center items-center p-2">
        <Icon.Key size="120" />
      </div>
      <Link
        href="/onboarding/sign-up"
        className="mt-4 lg:mt-0"
        id="onboarding-sign-up-link"
      >
        <Button.Large variant="secondary" icon={<Icon.UserRectangle />}>
          New pubky
        </Button.Large>
      </Link>
    </Card.Primary>
  );
}
