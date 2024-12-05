'use client';
import { Modal } from '../Modal';
import { PostView } from '@/types/Post';

interface RepostProps {
  showModalRepost: boolean;
  setShowModalRepost: React.Dispatch<React.SetStateAction<boolean>>;
  post: PostView;
  handleRepost: () => Promise<void>;
}

export default function Repost({
  showModalRepost,
  setShowModalRepost,
  post,
}: RepostProps) {
  return (
    <Modal.Repost
      post={post}
      showModalRepost={showModalRepost}
      setShowModalRepost={setShowModalRepost}
    />
  );
}
