'use client';

import { useEffect, useRef } from 'react';
import { useModal } from '@/contexts';
import { getPost } from '@/services/postService';
import { usePubkyClientContext } from '@/contexts';
import { Utils } from '@social/utils-shared';

interface PostPageClientProps {
  pubky: string;
  postId: string;
}

export default function PostPage({ pubky, postId }: PostPageClientProps) {
  const { openModal } = useModal();
  const { pubky: currentUserPubky } = usePubkyClientContext();
  const hasOpenedModal = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const openPostModal = async () => {
      // Prevent opening multiple times
      if (hasOpenedModal.current) return;

      console.log('PostPageClient: Attempting to open modal for post', { pubky, postId });

      try {
        // Fetch the post data
        const post = await getPost(pubky, postId, currentUserPubky ?? '');

        if (post) {
          console.log('PostPageClient: Post found, opening modal');
          // Open the PostView modal with the fetched post
          openModal('postView', { post });
          hasOpenedModal.current = true;
        } else {
          console.log('PostPageClient: Post not found, opening modal with deleted post');
          // Create a mock deleted post when the post doesn't exist
          const mockDeletedPost = {
            details: {
              id: postId,
              author: pubky,
              content: '[DELETED]',
              uri: `pubky://${pubky}/posts/${postId}`,
              indexed_at: new Date().toISOString(),
              kind: 'post'
            },
            relationships: {}
          };
          openModal('postView', { post: mockDeletedPost });
          hasOpenedModal.current = true;
        }
      } catch (error) {
        console.error('PostPageClient: Error fetching post for modal:', error);
        // Even if there's an error, open the modal with a mock deleted post
        const mockDeletedPost = {
          details: {
            id: postId,
            author: pubky,
            content: '[DELETED]',
            uri: `pubky://${pubky}/posts/${postId}`,
            indexed_at: new Date().toISOString(),
            kind: 'post'
          },
          relationships: {}
        };
        openModal('postView', { post: mockDeletedPost });
        hasOpenedModal.current = true;
      }
    };

    // Single attempt with a small delay to ensure the modal context is ready
    timeoutRef.current = setTimeout(openPostModal, 100);

    return () => {
      // Cleanup timeout when component unmounts
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [pubky, postId, currentUserPubky, openModal]);

  // This component doesn't render anything visible
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white" />
    </div>
  );
}
