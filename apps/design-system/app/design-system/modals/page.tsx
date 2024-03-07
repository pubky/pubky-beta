'use client';

import { useEffect, useState } from 'react';
import {
  Button,
  Modal,
  Input,
  Typography,
  PostUtil,
  Icon,
} from '@social/ui-shared';

export default function Index() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    console.log('show', show);
  }, [show]);

  return (
    <div className="flex-1 w-full h-screen bg-black p-10">
      <div className={'pb-8'}>
        <Button.Create onClick={() => setShow(true)} />
        <Modal.Root
          show={show}
          closeModal={() => setShow(false)}
          className="max-w-[1200px]"
        >
          <Modal.CloseAction onClick={() => setShow(false)} />
          <Modal.Header title="New Post">
            <Button.Action
              variant="posts"
              active
              onClick={() => console.log('button clicked 1')}
            />
            <Button.Action
              variant="image"
              onClick={() => console.log('button clicked 2')}
            />
            <Button.Action
              variant="link"
              onClick={() => console.log('button clicked 3')}
            />
          </Modal.Header>
          <Modal.Content>
            <div className="mt-6 inline-flex col-span-2">
              <Input.TextArea
                className="h-[285px] p-12"
                placeholder="Write content, drop an image, or paste a link"
              />
            </div>
            <div className="flex-col justify-start items-start gap-5 mt-4 inline-flex">
              <Typography.H2>Suggested Tags</Typography.H2>
              <div className="justify-start items-start">
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
              <div className="flex-col w-full items-start flex">
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
                <Modal.SubmitAction onClick={() => setShow(false)}>
                  Publish Post
                </Modal.SubmitAction>
              </div>
            </div>
          </Modal.Content>
        </Modal.Root>
      </div>
    </div>
  );
}
