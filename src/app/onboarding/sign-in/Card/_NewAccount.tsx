import Link from 'next/link';
import { Card, Button, Icon } from '@social/ui-shared';

export default function NewAccount() {
  return (
    <Card.Primary
      title="Create new pubky"
      text="Another option is to create a new account and profile on Pubky itself."
      className="w-full col-span-3"
    >
      <div className="flex justify-center items-center p-12 sm:p-2">
        <Icon.Key size="128" />
      </div>
      <Link href="/onboarding/sign-up" className="mt-4 lg:mt-0" id="onboarding-sign-up-link">
        <Button.Large
          className="shadow backdrop-blur-[10px]"
          variant="secondary"
          icon={<Icon.UserRectangle size="16" />}
        >
          New pubky
        </Button.Large>
      </Link>
    </Card.Primary>
  );
}
