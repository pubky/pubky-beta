'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Error() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home after a short delay
    const timer = setTimeout(() => {
      router.replace('/home');
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="fixed inset-0 z-50 bg-[#05050A] flex items-center justify-center">
      <div className="text-white text-lg text-center">
        <div>Post not found</div>
        <div className="text-sm text-gray-400 mt-2">Redirecting to home...</div>
      </div>
    </div>
  );
} 