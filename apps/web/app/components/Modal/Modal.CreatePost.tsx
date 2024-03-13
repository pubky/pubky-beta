'use client';

import {
  Button,
  Icon,
  Input,
  Modal,
  PostUtil,
  Typography,
} from '@social/ui-shared';
import Image from 'next/image';
import { useState } from 'react';
import Link from './Modal.Link';

interface CreatePostProps {
  showModalPost: boolean;
  showModalLink: boolean;
  setShowModalPost: React.Dispatch<React.SetStateAction<boolean>>;
  setShowModalLink: React.Dispatch<React.SetStateAction<boolean>>;
  modalPostRef: React.RefObject<HTMLDivElement>;
  modalLinkRef: React.RefObject<HTMLDivElement>;
}

export default function CreatePost({
  showModalPost,
  showModalLink,
  setShowModalPost,
  setShowModalLink,
  modalPostRef,
  modalLinkRef,
}: CreatePostProps) {
  const [clipboardContent, setClipboardContent] = useState('');
  const [selectedImage, setSelectedImage] = useState('');

  const handleClipboardClick = () => {
    navigator.clipboard.readText().then((content) => {
      setClipboardContent(content);
    });
  };

  const handleImageClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage('');
  };
  return (
    <>
      <Modal.Root
        modalRef={modalPostRef}
        show={showModalPost}
        closeModal={() => setShowModalPost(false)}
        className="max-w-[1200px]"
      >
        <Modal.CloseAction onClick={() => setShowModalPost(false)} />
        <Modal.Header title="New Post" />
        <Modal.Content className="inline-flex flex-col gap-2 lg:grid lg:grid-cols-3 lg:gap-6">
          <div className="mt-6 col-span-2">
            <div>
              <div>
                <Input.TextArea
                  className="h-[285px] p-12"
                  placeholder="Write content, drop an image, or paste a link"
                  defaultValue={clipboardContent}
                />
                {selectedImage && (
                  <div className="hidden lg:flex relative">
                    <Button.Action
                      variant="custom"
                      icon={<Icon.X size="24" />}
                      onClick={handleRemoveImage}
                      className="z-10 absolute bottom-32 left-44"
                    />
                    <Image
                      width={160}
                      height={106}
                      className="absolute max-w-40 max-h-[106px] rounded-lg bottom-14 left-10"
                      alt="image"
                      src={selectedImage}
                    />
                  </div>
                )}
              </div>
              <div className="gap-3 flex mt-9">
                <label htmlFor="fileInput">
                  <Button.Action
                    variant="image"
                    label="Image"
                    onClick={() => console.log('button clicked 1')}
                    className="hidden lg:flex"
                  />
                  <input
                    id="fileInput"
                    type="file"
                    accept="image/*"
                    onChange={handleImageClick}
                    className="hidden"
                  />
                </label>
                <Button.Action
                  variant="custom"
                  icon={<Icon.Clipboard />}
                  onClick={handleClipboardClick}
                  label="Paste"
                  className="hidden lg:flex"
                />
                <Button.Action
                  variant="link"
                  onClick={() => {
                    setShowModalLink(true);
                    setShowModalPost(false);
                  }}
                  label="Link"
                  className="hidden lg:flex"
                />
              </div>
            </div>
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

            <div className="w-full mt-4">
              <Modal.SubmitAction onClick={() => setShowModalPost(false)}>
                Publish Post
              </Modal.SubmitAction>
            </div>
          </div>
        </Modal.Content>
      </Modal.Root>
      <Link
        showModalLink={showModalLink}
        setShowModalLink={setShowModalLink}
        setShowModalPost={setShowModalPost}
        modalLinkRef={modalLinkRef}
      />
    </>
  );
}
