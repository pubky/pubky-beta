import {
  Button,
  Card,
  Icon,
  Input,
  Modal,
  PostUtil,
  Typography,
} from '@social/ui-shared';
import Post from '../Component.Post';

interface RepostProps {
  showModalRepost: boolean;
  setShowModalRepost: React.Dispatch<React.SetStateAction<boolean>>;
  modalRepostRef: React.RefObject<HTMLDivElement>;
  setShowModalLink: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Repost({
  showModalRepost,
  setShowModalRepost,
  modalRepostRef,
  setShowModalLink,
}: RepostProps) {
  return (
    <Modal.Root
      modalRef={modalRepostRef}
      show={showModalRepost}
      closeModal={() => setShowModalRepost(false)}
      className="max-w-[1200px]"
    >
      <Modal.CloseAction onClick={() => setShowModalRepost(false)} />
      <Modal.Header title="Repost" />
      <Modal.Content className="inline-flex mt-6 flex-col gap-2 lg:grid lg:grid-cols-3 lg:gap-6">
        <div>
          <Card.Primary
            background="bg-white bg-opacity-10"
            className="scrollbar-thin scrollbar-webkit overflow-x-auto h-[334px] border border-white border-opacity-10 shadow-[0_4px_8px_0_rgba(0,0,0,0.32)_inset] rounded-lg flex flex-col"
          >
            <div className="h-full mb-6">
              <Input.TextArea
                className="no-scrollbar h-full p-4"
                placeholder="Optional comment"
              />
            </div>
            {/**<div className="hidden lg:flex relative">
                  <img
                    className="max-w-full rounded-lg"
                    alt="image"
                    src="/images/user.png"
                  />
                   <Button.Action
                      variant="custom"
                      icon={<Icon.X size="24" />}
                      className='-ml-6 -mt-5'
                    />
                </div>
                <div>
                  <Content.Divider />
                 <div className='flex'>
                  <Typography.H2>
                    Weighing Options of Bitcoin Private Key Management
                  </Typography.H2>
                  <Button.Action
                      variant="custom"
                      icon={<Icon.X size="24" />}
                    />
                    </div>
                  <Typography.Caption className="text-white text-opacity-80">
                    https://bitcoinmagazine.com/
                  </Typography.Caption>
                  <img
                    alt="postImage"
                    src="/images/user.png"
                    className="mt-6 max-w-full rounded-2xl"
                  />
  </div>*/}
          </Card.Primary>
          <div className="gap-3 flex mt-9">
            <Button.Action
              variant="image"
              label="Image"
              onClick={() => console.log('button clicked 1')}
              className="hidden lg:flex"
            />

            <Button.Action
              variant="custom"
              icon={<Icon.Clipboard />}
              label="Paste"
              onClick={() => console.log('button clicked 2')}
              className="hidden lg:flex"
            />
            <Button.Action
              variant="link"
              label="Link"
              onClick={() => {
                setShowModalLink(true);
              }}
              className="hidden lg:flex"
            />
          </div>
        </div>
        <Post className="hidden lg:inline-flex" />
        <div className="flex-col inline-flex justify-between">
          <div className="flex-col justify-start items-start gap-5 inline-flex">
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
          </div>
          <div className="w-full">
            <Modal.SubmitAction
              icon={<Icon.Repost />}
              onClick={() => setShowModalRepost(false)}
            >
              Repost
            </Modal.SubmitAction>
          </div>
        </div>
      </Modal.Content>
    </Modal.Root>
  );
}
