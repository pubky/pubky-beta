'use client';

import {
  Button,
  Modal,
  Input,
  Typography,
  Post,
  Icon,
} from '@social/ui-shared';
import { useState } from 'react';

export default async function Index() {
  const [show, setShow] = useState(false);

  return (
    <div className="flex-1 w-full h-screen bg-black p-10">
      <div className={'pb-8'}>
        <Button.Create onClick={() => setShow(true)} />
        <Modal.Root show={show}>
          <Modal.CloseAction onClick={() => console.log('hey')} />
          <Modal.Header title="New Post">
            <Button.Action variant="posts" active />
            <Button.Action variant="image" />
            <Button.Action variant="link" />
          </Modal.Header>
          <Modal.Content>
            <div className="mt-6 inline-flex col-span-2">
              <Input.Text
                height="h-[285px]"
                placeHolder="Write content, drop an image, or paste a link"
                padding="p-12"
                multiline
              />
            </div>
            <div className="flex-col justify-start items-start gap-5 mt-4 inline-flex">
              <Typography.H2>Suggested Tags</Typography.H2>
              <div className="justify-start items-start">
                <Post.Tag color="amber" styles="mr-2 my-1">
                  #Bitcoin
                </Post.Tag>
                <Post.Tag color="amber" styles="mr-2 my-1">
                  #Satoshi
                </Post.Tag>
                <Post.Tag color="red" styles="mr-2 my-1">
                  #P2P
                </Post.Tag>
                <Post.Tag color="blue" styles="mr-2 my-1">
                  #Keys
                </Post.Tag>
                <Post.Tag color="blue" styles="mr-2 my-1">
                  #Scalability
                </Post.Tag>
                <Post.Tag color="green" styles="mr-2 my-1">
                  #Whitepaper
                </Post.Tag>
                <Post.Tag color="cyan" styles="mr-2 my-1">
                  #PoW
                </Post.Tag>
                <Post.Tag color="yellow" styles="mr-2 my-1">
                  #Cryptography
                </Post.Tag>
                <Post.Tag color="fuchsia" styles="mr-2 my-1">
                  #Quote
                </Post.Tag>
                <Post.Tag color="amber" styles="mr-2 my-1">
                  #Bitcointalk
                </Post.Tag>
              </div>
              <div className="flex-col w-full items-start flex">
                <Input.Text
                  label="Add tag:"
                  placeHolder="#"
                  icon={
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
