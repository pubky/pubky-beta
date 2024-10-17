import Link from 'next/link';
import { Card, Button, Icon } from '@social/ui-shared';

export default function SigninBack() {
  return (
    <Card.Primary
      title="Been here before?"
      text="Sign back into Pubky by uploading your Pubky recovery file or entering your recovery phrase."
      className="w-full col-span-3"
    >
      <div className="flex justify-center items-center">
        <Icon.SignIn size="120" />
      </div>
      <Link
        href="/sign-in"
        className="mt-4 lg:mt-0"
        id="onboarding-sign-up-link"
      >
        <Button.Large variant="secondary" icon={<Icon.SignIn size="16" />}>
          Sign in to Pubky
        </Button.Large>
      </Link>
    </Card.Primary>
  );
}
