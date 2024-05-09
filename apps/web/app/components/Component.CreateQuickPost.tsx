'use client';

import { Button, Icon, Input, Typography } from '@social/ui-shared';
import { useEffect, useState } from 'react';
import { useClientContext } from '../../contexts/client';
import { minifyPubky } from '../../libs/pubkyHelper';
import Image from 'next/image';
import { INewPost } from '../../types';
import Link from 'next/link';

export default function CreateQuickPost() {
  const { pubky, getUserIndexed, createPost, setPosts } = useClientContext();
  const [pic, setPic] = useState('/images/Userpic.png');
  const [name, setName] = useState('Loading...');
  const [handler, setHandler] = useState('');
  const [content, setContent] = useState('');
  const [sendingPost, setSendingPost] = useState(false);

  async function fetchProfile() {
    try {
      if (!pubky) return;
      const userProfile = await getUserIndexed(pubky);

      if (userProfile) {
        setPic(userProfile.profile?.image || '/images/Userpic.png');
        setName(userProfile.profile?.name || 'Loading...');
        setHandler(pubky);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async () => {
    if (sendingPost) {
      return;
    }
    try {
      setSendingPost(true);

      const newPost = await createPost(content);
      if (newPost) {
        setPosts((prev: INewPost) => ({
          ...{ [newPost.uri]: newPost },
          ...prev,
        }));
      }
      setContent('');
    } catch (error) {
      console.log(error);
    } finally {
      setSendingPost(false);
    }
  };

  return (
    <div className="p-6 rounded-2xl border-dashed border border-white border-opacity-30 flex-col justify-start items-start inline-flex">
      <Link
        href="/profile"
        className="cursor-pointer justify-start items-center gap-2 flex"
      >
        <Image
          width={32}
          height={32}
          className="w-8 h-8 rounded-full"
          alt="user-image"
          src={pic}
        />
        <Typography.Body
          className={`hover:underline hover:decoration-solid`}
          variant="medium-bold"
        >
          {name}
        </Typography.Body>
        <Typography.Label className="text-opacity-30">
          {minifyPubky(handler)}
        </Typography.Label>
      </Link>
      <div className="w-full flex justify-between gap-6 items-start inline-flex">
        <Input.CursorArea
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setContent(e.target.value)
          }
          value={content}
          className="w-[450px] h-auto mt-4"
          placeholder="What's in your mind?"
        />
        <Button.Large
          className="h-[25px]"
          icon={<Icon.PaperPlaneRight color={!content ? 'gray' : 'white'} />}
          disabled={!content}
          loading={sendingPost}
          onClick={content && !sendingPost ? () => handleSubmit() : undefined}
        >
          Publish
        </Button.Large>
      </div>
    </div>
  );
}
