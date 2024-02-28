/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { Button } from '@social/ui-shared';
import { useEffect, useRef, useState } from 'react';

export default function CreatePost() {
  const [showModalPost, setShowModalPost] = useState(false);
  const modalPostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutsideModalPost = (event: MouseEvent) => {
      if (
        modalPostRef.current &&
        !modalPostRef.current.contains(event.target as Node)
      ) {
        setShowModalPost(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutsideModalPost);

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideModalPost);
    };
  }, [modalPostRef]);

  return (
    <div className="fixed bottom-10 right-10 max-w-[50%] max-h-[50%]">
      <Button.Create onClick={() => setShowModalPost(true)} />
    </div>
  );
}
