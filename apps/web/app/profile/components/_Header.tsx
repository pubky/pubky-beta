'use client';

import * as Components from '@/components';
import { usePubkyClientContext } from '@/contexts';
import { Icon } from '@social/ui-shared';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function Header() {
  const router = useRouter();
  const { seed } = usePubkyClientContext();
  const [disposableAccount, setDisposableAccount] = useState(false);
  const [showSheetLogout, setShowSheetLogout] = useState(false);

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
          <Link href="/settings">
            <Icon.GearSix size="20" />
          </Link>
        }
        rightIcon={
          <div
            className="cursor-pointer"
            onClick={
              disposableAccount
                ? () => setShowSheetLogout(true)
                : () => router.push('/logout')
            }
          >
            <Icon.SignOut size="20" />
          </div>
        }
      />
      <Components.BottomSheet.Logout
        show={showSheetLogout}
        setShow={setShowSheetLogout}
      />
    </>
  );
}
