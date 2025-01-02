import * as Components from '@/components';
import { Icon } from '@social/ui-shared';
import Link from 'next/link';

export function Header() {
  return (
    <>
      <Components.Header title="Profile" />
      <Components.HeaderMobile
        leftIcon={
          <Link href="/settings">
            <Icon.GearSix size="20" />
          </Link>
        }
        rightIcon={
          <Link href="/logout">
            <Icon.SignOut size="20" />
          </Link>
        }
      />
    </>
  );
}
