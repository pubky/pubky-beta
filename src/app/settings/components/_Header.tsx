'use client';

import * as Components from '@/components';
import { Icon } from '@social/ui-shared';
import { useRouter } from 'next/navigation';

export function Header() {
  const router = useRouter();

  return (
    <>
      <Components.Header title="Settings" />
      <Components.HeaderMobile
        leftIcon={
          <div className="cursor-pointer" onClick={() => router.push('/profile')}>
            <Icon.ArrowLeft size="24" />
          </div>
        }
      />
    </>
  );
}
