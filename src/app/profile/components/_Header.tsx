'use client';

import * as Components from '@/components';
import { useModal, usePubkyClientContext } from '@/contexts';
import { Icon } from '@social/ui-shared';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function Header() {
  const router = useRouter();
  const { seed } = usePubkyClientContext();
  const { openModal } = useModal();
  const [disposableAccount, setDisposableAccount] = useState(false);

  useEffect(() => {
    if (seed) {
      setDisposableAccount(true);
    } else {
      setDisposableAccount(false);
    }
  }, [seed]);

  return (
    <>
      <Components.Header title="Profile" />
      <Components.HeaderMobile
        leftIcon={
          <Link href="/settings/edit">
            <Icon.Pencil size="24" />
          </Link>
        }
        rightIcon={
          <div
            className="cursor-pointer"
            onClick={disposableAccount ? () => openModal('logout') : () => router.push('/logout')}
          >
            <Icon.SignOut size="24" />
          </div>
        }
      />
    </>
  );
}
