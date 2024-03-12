/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import {
  Button,
  Icon,
  Input,
  Modal,
  PostUtil,
  Typography,
} from '@social/ui-shared';
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
    <>
      <div className="fixed bottom-5 right-5 sm:bottom-10 sm:right-10">
        <Button.Create onClick={() => setShowModalPost(true)} />
      </div>

      <Modal.Root
        modalRef={modalPostRef}
        show={showModalPost}
        closeModal={() => setShowModalPost(false)}
        className="max-w-[1200px]"
      >
        <Modal.CloseAction onClick={() => setShowModalPost(false)} />
        <Modal.Header title="New Post" className="mt-2">
          <Button.Action
            variant="posts"
            active
            onClick={() => console.log('button clicked 1')}
            className="hidden lg:block"
          />
          <Button.Action
            variant="image"
            onClick={() => console.log('button clicked 2')}
            className="hidden lg:block"
          />
          <Button.Action
            variant="link"
            onClick={() => console.log('button clicked 3')}
            className="hidden lg:block"
          />
        </Modal.Header>
        <Modal.Content className="inline-flex flex-col gap-2 lg:grid lg:grid-cols-3 lg:gap-6">
          <div className="mt-6 inline-flex col-span-2">
            <Input.TextArea
              className="h-[285px] p-12"
              placeholder="Write content, drop an image, or paste a link"
            />
          </div>
          <div className="flex-col justify-start items-start gap-5 mt-4 inline-flex">
            <Typography.H2 className="hidden lg:block">
              Suggested Tags
            </Typography.H2>
            <div className="hidden lg:block justify-start items-start">
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
            <div className="hidden lg:flex flex-col w-full items-start">
              <Input.Label value="Add tag:" />
              <Input.Text
                placeholder="#"
                action={
                  <Button.Action
                    variant="custom"
                    icon={<Icon.Plus size="20" />}
                  />
                }
              />
            </div>

            <div className="w-full">
              <Modal.SubmitAction onClick={() => setShowModalPost(false)}>
                Publish Post
              </Modal.SubmitAction>
            </div>
          </div>
        </Modal.Content>
      </Modal.Root>
    </>
  );
}
