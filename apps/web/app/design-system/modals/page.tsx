'use client';

import { useEffect, useState } from 'react';
import {
  Button,
  Modal,
  Input,
  Typography,
  Post,
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
              <Input.Text
                value=""
                className="h-[285px] p-12"
                placeHolder="Write content, drop an image, or paste a link"
              />
            </div>
            <div className="flex-col justify-start items-start gap-5 mt-4 inline-flex">
              <Typography.H2>Suggested Tags</Typography.H2>
              <div className="justify-start items-start">
                <Post.Tag clicked color="amber" className="mr-2 my-1">
                  #Bitcoin
                </Post.Tag>
                <Post.Tag clicked color="amber" className="mr-2 my-1">
                  #Satoshi
                </Post.Tag>
                <Post.Tag clicked color="red" className="mr-2 my-1">
                  #P2P
                </Post.Tag>
                <Post.Tag clicked color="blue" className="mr-2 my-1">
                  #Keys
                </Post.Tag>
                <Post.Tag clicked color="blue" className="mr-2 my-1">
                  #Scalability
                </Post.Tag>
                <Post.Tag clicked color="green" className="mr-2 my-1">
                  #Whitepaper
                </Post.Tag>
                <Post.Tag clicked color="cyan" className="mr-2 my-1">
                  #PoW
                </Post.Tag>
                <Post.Tag clicked color="yellow" className="mr-2 my-1">
                  #Cryptography
                </Post.Tag>
                <Post.Tag clicked color="fuchsia" className="mr-2 my-1">
                  #Quote
                </Post.Tag>
                <Post.Tag clicked color="amber" className="mr-2 my-1">
                  #Bitcointalk
                </Post.Tag>
              </div>
              <div className="flex-col w-full items-start flex">
                <Input.Text
                  value={''}
                  label="Add tag:"
                  placeHolder="#"
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
