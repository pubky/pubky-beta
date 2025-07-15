'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useModal } from '@/contexts';
import { getPost } from '@/services/postService';
import { usePubkyClientContext } from '@/contexts';

type Props = {
  params: { pubky: string; postId: string };
};

export default function PostPage({ params }: Props) {
  const router = useRouter();
  const { openModal, isOpen } = useModal();
  const { pubky } = usePubkyClientContext();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const openPostModal = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch the post data
        const post = await getPost(params.pubky, params.postId, pubky ?? '');

        if (post) {
          // Open the PostView modal with the fetched post
          openModal('postView', { post });
          setIsLoading(false);
        } else {
          setError('Post not found');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching post for modal:', error);
        setError('Error loading post');
        setIsLoading(false);
      }
    };

    // Only open modal if it's not already open
    if (!isOpen('postView')) {
      openPostModal();
    } else {
      setIsLoading(false);
    }
  }, [params.pubky, params.postId, pubky, openModal, isOpen]);

  // If there's an error, redirect to home after a delay
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        router.replace('/');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [error, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 bg-[#05050A] flex items-center justify-center">
        <div className="text-white text-lg">Loading post...</div>
      </div>
    );
  }
}
