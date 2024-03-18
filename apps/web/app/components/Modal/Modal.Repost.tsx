'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import {
  Icon,
  Button,
  PostUtil,
  Modal,
  Input,
  Typography,
  Card,
  Post,
} from '@social/ui-shared';

interface RepostProps extends React.HTMLAttributes<HTMLDivElement> {
  showModalRepost: boolean;
  setShowModalRepost: React.Dispatch<React.SetStateAction<boolean>>;
  bookmark?: boolean;
}

export default function Repost({
  showModalRepost,
  setShowModalRepost,
  bookmark = false,
}: RepostProps) {
  const modalRePostRef = useRef<HTMLDivElement>(null);

  const images = [
    {
      src: '/images/user.png',
      alt: '1',
    },
    {
      src: '/images/user.png',
      alt: '2',
    },
    {
      src: '/images/user.png',
      alt: '3',
    },
    {
      src: '/images/user.png',
      alt: '4',
    },
    {
      src: '/images/user.png',
      alt: '5',
    },
  ];

  useEffect(() => {
    const handleClickOutsideModalRePost = (event: MouseEvent) => {
      if (
        modalRePostRef.current &&
        !modalRePostRef.current.contains(event.target as Node)
      ) {
        setShowModalRepost(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutsideModalRePost);

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideModalRePost);
    };
  }, [modalRePostRef, setShowModalRepost]);

  return (
    <Modal.Root
      modalRef={modalRePostRef}
      show={showModalRepost}
      closeModal={() => setShowModalRepost(false)}
      className="w-[480px]"
    >
      <Modal.CloseAction onClick={() => setShowModalRepost(false)} />
      <div className="items-stretch flex-col inline-flex gap-12">
        <Modal.Header title="Repost" />
        <Modal.Content className="block">
          <Input.Label value="Comment" />
          <Input.Text placeholder="Optional" />
          <div className="mt-6">
            <Card.Primary
              background="bg-white bg-opacity-10"
              className="w-[384px] z-auto border-0"
            >
              <div className="pb-6 justify-start items-start inline-flex">
                <div className="justify-start items-center gap-4 flex">
                  <Image
                    width={32}
                    height={32}
                    className="rounded-full"
                    alt="user"
                    src="/images/user.png"
                  />
                  <Typography.Body variant="medium-bold">
                    Satoshi Nakamoto
                  </Typography.Body>
                </div>
                <div className="grow justify-end items-center gap-1 flex mt-2">
                  <Icon.Clock size="16" color="gray" />
                  <Typography.Caption
                    variant="bold"
                    className="text-white text-opacity-30"
                  >
                    27m
                  </Typography.Caption>
                </div>
              </div>
              <div>
                <Typography.Body variant="medium" color="text-opacity-80">
                  You either want lots of people using Bitcoin (holding Bitcoin
                  keys) or you dont. Many of you seem to believe things that
                  require both positions.
                </Typography.Body>
                <div className="justify-start items-start gap-2 flex mt-6">
                  <PostUtil.Tag clicked color="amber">
                    #Bitcoin
                  </PostUtil.Tag>
                  <Button.Action
                    variant="custom"
                    size="small"
                    icon={<Icon.Plus />}
                  />
                  <PostUtil.Counter counter={16} />
                  <Post.UserPic images={images} />
                </div>
                <div className="justify-start items-start gap-2 flex mt-6">
                  <Button.Action
                    size="small"
                    variant="custom"
                    icon={<Icon.Tag size="16" />}
                    counter={3}
                  />
                  <Button.Action
                    size="small"
                    variant="custom"
                    icon={<Icon.ChatCircleText size="16" />}
                    counter={2}
                  />
                  <Button.Action
                    size="small"
                    variant="custom"
                    icon={<Icon.Repost size="16" />}
                    counter={7}
                  />
                  <Button.Action
                    size="small"
                    variant="custom"
                    icon={
                      <Icon.BookmarkSimple
                        opacity={bookmark ? '1' : '0.2'}
                        size="16"
                      />
                    }
                  />
                </div>
              </div>
            </Card.Primary>
          </div>
        </Modal.Content>
        <Modal.SubmitAction
          icon={<Icon.Repost />}
          onClick={() => setShowModalRepost(false)}
        >
          Repost
        </Modal.SubmitAction>
      </div>
    </Modal.Root>
  );
}
