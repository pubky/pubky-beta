/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import {
  Icon,
  Button,
  PostUtil,
  Post,
  Card,
  Modal,
  Input,
  Typography,
} from '@social/ui-shared';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { twMerge } from 'tailwind-merge';

interface PostsLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  bookmark?: boolean;
}

export default function PostsLayout({
  children,
  bookmark = false,
  ...rest
}: PostsLayoutProps) {
  const [showModalRePost, setShowModalRePost] = useState(false);
  const [showModalTag, setShowModalTag] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const modalRePostRef = useRef<HTMLDivElement>(null);
  const modalTagRef = useRef<HTMLDivElement>(null);
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
    const handleClickOutsideModalTag = (event: MouseEvent) => {
      if (
        modalTagRef.current &&
        !modalTagRef.current.contains(event.target as Node)
      ) {
        setShowModalTag(false);
      }
    };

    const handleClickOutsideModalRePost = (event: MouseEvent) => {
      if (
        modalRePostRef.current &&
        !modalRePostRef.current.contains(event.target as Node)
      ) {
        setShowModalRePost(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutsideModalTag);
    document.addEventListener('mousedown', handleClickOutsideModalRePost);

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideModalTag);
      document.removeEventListener('mousedown', handleClickOutsideModalRePost);
    };
  }, [drawerRef, modalTagRef, modalRePostRef]);

  return (
    <>
      <div {...rest} className={twMerge(rest.className)}>
        {children}
        <Modal.Root
          modalRef={modalTagRef}
          show={showModalTag}
          closeModal={() => setShowModalTag(false)}
          className="w-full items-stretch gap-6"
        >
          <Modal.CloseAction onClick={() => setShowModalTag(false)} />
          <Modal.Header title="Tag" />

          <Modal.Content className="block">
            <div className="flex-col gap-6 inline-flex">
              <div>
                <Typography.Label className="text-opacity-30 font-medium">
                  Emotag
                </Typography.Label>
                <div className="mt-2 gap-2 inline-flex">
                  <PostUtil.Tag clicked={false} color="red">
                    🔥
                  </PostUtil.Tag>
                  <PostUtil.Tag clicked={false} color="cyan">
                    👀
                  </PostUtil.Tag>
                  <PostUtil.Tag clicked={false} color="purple">
                    😂
                  </PostUtil.Tag>
                  <PostUtil.Tag clicked={false} color="yellow">
                    👍
                  </PostUtil.Tag>
                  <PostUtil.Tag clicked={false} color="blue">
                    ⭐
                  </PostUtil.Tag>
                  <PostUtil.Tag clicked={false} color="green">
                    🙏
                  </PostUtil.Tag>
                  <Button.Action
                    size="small"
                    variant="custom"
                    icon={<Icon.Plus />}
                  />
                </div>
              </div>
              <div>
                <Typography.Label className="text-opacity-30 font-medium">
                  SUGGESTED & RECENT
                </Typography.Label>
                <div className="mt-2 justify-start items-start">
                  <PostUtil.Tag clicked color="amber" className="mr-2 my-1">
                    #Bitcoin
                  </PostUtil.Tag>
                  <PostUtil.Tag clicked color="amber" className="mr-2 my-1">
                    #Satoshi
                  </PostUtil.Tag>
                  <PostUtil.Tag clicked color="red" className="mr-2 my-1">
                    #P2P
                  </PostUtil.Tag>
                  <PostUtil.Tag clicked color="blue" className="mr-2 my-1">
                    #Keys
                  </PostUtil.Tag>
                  <PostUtil.Tag clicked color="blue" className="mr-2 my-1">
                    #Scalability
                  </PostUtil.Tag>
                  <PostUtil.Tag clicked color="green" className="mr-2 my-1">
                    #Whitepaper
                  </PostUtil.Tag>
                  <PostUtil.Tag clicked color="cyan" className="mr-2 my-1">
                    #PoW
                  </PostUtil.Tag>
                  <PostUtil.Tag clicked color="yellow" className="mr-2 my-1">
                    #Cryptography
                  </PostUtil.Tag>
                  <PostUtil.Tag clicked color="fuchsia" className="mr-2 my-1">
                    #Quote
                  </PostUtil.Tag>
                  <PostUtil.Tag clicked color="amber" className="mr-2 my-1">
                    #Bitcointalk
                  </PostUtil.Tag>
                </div>
              </div>
              <div>
                <Input.Label value="Add tag" />
                <Input.Text
                  placeholder="#"
                  action={
                    <Button.Action variant="custom" icon={<Icon.Plus />} />
                  }
                />
              </div>
            </div>
            <div className="mt-6"></div>
            <div className="w-full mt-4">
              <Modal.SubmitAction
                icon={<Icon.Check />}
                onClick={() => setShowModalTag(false)}
              >
                Apply Tags
              </Modal.SubmitAction>
            </div>
          </Modal.Content>
        </Modal.Root>
        <Modal.Root
          modalRef={modalRePostRef}
          show={showModalRePost}
          closeModal={() => setShowModalRePost(false)}
          className="w-[480px] h-[740px] items-stretch gap-3"
        >
          <Modal.CloseAction onClick={() => setShowModalRePost(false)} />
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
                    You either want lots of people using Bitcoin (holding
                    Bitcoin keys) or you dont. Many of you seem to believe
                    things that require both positions.
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
            <div className="w-full mt-4">
              <Modal.SubmitAction
                icon={<Icon.Repost />}
                onClick={() => setShowModalRePost(false)}
              >
                Repost
              </Modal.SubmitAction>
            </div>
          </Modal.Content>
        </Modal.Root>
      </div>
    </>
  );
}
