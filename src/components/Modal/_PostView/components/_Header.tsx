'use client';

import * as Components from '@/components';
import { Icon } from '@social/ui-shared';
import { useRouter } from 'next/navigation';

export function Header() {
  const router = useRouter();

  const handleBack = async () => {
    // Check if there's enough history to go back
    if (window.history.length >= 2) {
      router.back();
    } else {
      router.push('/home');
    }
  };

  return (
    <>
      <Components.Header title="Post" />
      <Components.HeaderMobile
        postView
        leftIcon={
          <div className="cursor-pointer" onClick={handleBack}>
            <Icon.ArrowLeft size="24" />
          </div>
        }
      />
    </>
  );
}
