'use client';

import { useEffect, useRef } from 'react';
import {
  Icon,
  Button,
  PostUtil,
  Modal,
  Input,
  Typography,
} from '@social/ui-shared';

interface TagProps extends React.HTMLAttributes<HTMLDivElement> {
  showModalTag: boolean;
  setShowModalTag: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Tag({ showModalTag, setShowModalTag }: TagProps) {
  const modalTagRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutsideModalTag = (event: MouseEvent) => {
      if (
        modalTagRef.current &&
        !modalTagRef.current.contains(event.target as Node)
      ) {
        setShowModalTag(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutsideModalTag);

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideModalTag);
    };
  }, [modalTagRef, setShowModalTag]);

  return (
    <Modal.Root
      modalRef={modalTagRef}
      show={showModalTag}
      closeModal={() => setShowModalTag(false)}
      className="w-[480px]"
    >
      <Modal.CloseAction onClick={() => setShowModalTag(false)} />
      <div className="items-stretch flex-col inline-flex gap-12">
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
                  icon={<Icon.Smiley />}
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
                  <Button.Medium
                    icon={<Icon.Plus size="16" />}
                    className="w-[101px]"
                  >
                    Add
                  </Button.Medium>
                }
              />
            </div>
          </div>
        </Modal.Content>
        <Modal.SubmitAction
          icon={<Icon.Check />}
          onClick={() => setShowModalTag(false)}
        >
          Apply Tags
        </Modal.SubmitAction>
      </div>
    </Modal.Root>
  );
}
