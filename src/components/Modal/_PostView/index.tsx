'use client';

import { Modal } from '@social/ui-shared';
import { Icon } from '@social/ui-shared';
import { useRouter } from 'next/navigation';
import { Post } from '@/components';
import { PostView } from '@/types/Post';
import { usePubkyClientContext } from '@/contexts';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useEffect } from 'react';
import PostRoot from '@/app/post/[pubky]/[postId]/components/_PostRoot';

interface PostViewModalProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  post: PostView;
}

export default function PostViewModal({ showModal, setShowModal, post }: PostViewModalProps) {
  const router = useRouter();
  const { pubky, setReplies } = usePubkyClientContext();
  const isMobile = useIsMobile(1024);

  // Reset replies when modal opens
  useEffect(() => {
    if (showModal) {
      setReplies([]);
    }
  }, [showModal, setReplies]);

  // Handle browser back button and disable background scrolling
  useEffect(() => {
    if (!showModal) return;

    const handlePopState = () => {
      setShowModal(false);
    };

    // Add a history entry when modal opens
    window.history.pushState({ modal: 'postView' }, '', window.location.pathname);

    // Listen for popstate (back button)
    window.addEventListener('popstate', handlePopState);

    // Disable background scrolling
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('popstate', handlePopState);
      // Re-enable background scrolling when modal closes
      document.body.style.overflow = '';
    };
  }, [showModal, setShowModal]);

  const handleClose = () => {
    setShowModal(false);
  };

  const handleShare = async () => {
    // Get the post URL for sharing
    const uriToUse = post.details.content === '' && post.relationships?.reposted 
      ? post.relationships.reposted 
      : post.details.uri;
    
    // Use the Utils.encodePostUri function to get the proper URL
    const { Utils } = require('@social/utils-shared');
    const postUrl = Utils.encodePostUri(uriToUse);
    
    // Create the full URL with domain
    const fullUrl = `${window.location.origin}${postUrl}`;
    
    try {
      await navigator.clipboard.writeText(fullUrl);
      // You could add a toast notification here to confirm the copy
    } catch (err) {
      console.error('Failed to copy URL to clipboard:', err);
      // Fallback: open in new tab if clipboard fails
      if (window.open) {
        window.open(fullUrl, '_blank');
      } else {
        router.push(postUrl);
      }
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#05050A]">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#05050A]">
          <button
            onClick={handleClose}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
          >
            <Icon.ArrowLeft size="24" />
            <span className="text-sm">Back</span>
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:text-white transition-colors"
          >
            <Icon.Copy size="16" />
            Share
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-[380px] sm:max-w-[600px] md:max-w-[720px] lg:max-w-[900px] xl:max-w-[1200px] w-full mx-auto p-4">
            {/* Show parent posts if this is a reply */}
            {post?.relationships?.replied && (
              <div className="mb-4">
                {/* This would need the RootParent component logic */}
              </div>
            )}
            
            {/* Main post */}
            <Post 
              post={post} 
              postType="single" 
              largeView={!isMobile}
              fullContent
            />
            
            {/* Replies section */}
            <div className="mt-6">
              <PostRoot uri={post?.details?.id} post={post} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 