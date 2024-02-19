import { Button } from '../Button';
import { Form } from '../Form';
import { Icon } from '../Icon';
import { Post } from '../Post';
import { Typography } from '../Typography';
import { Card } from '../Card';

type CreatePostModalProps = {
  closeModal?: () => void;
};

export const CreatePost = ({ closeModal }: CreatePostModalProps) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 flex justify-center items-center">
      <Card.Primary className="w-full max-w-[1200px] h-full max-h-[582px] p-12 bg-gradient-to-b from-stone-950 to-black rounded-2xl shadow border border-fuchsia-500 border-opacity-30 flex-col justify-start items-start gap-12 inline-flex">
        <Button.Action
          variant="custom"
          onClick={closeModal}
          icon={<Icon.X size="24" />}
          styles="absolute top-[-25px] right-[-25px]"
        />
        <div className="flex">
          <Typography.H1>New Post</Typography.H1>
          <div className="ml-4">
            <div className="gap-3 flex mt-2">
              <Button.Action variant="posts" active />
              <Button.Action variant="image" />
              <Button.Action variant="link" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6">
          <div className="mt-6 inline-flex col-span-2">
            <Form.InputField
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
              <Form.InputField
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
              <Button.Large
                svg={<Icon.PaperPlaneRight />}
                styles="mt-6"
                width="w-full"
              >
                Publish Post
              </Button.Large>
            </div>
          </div>
        </div>
      </Card.Primary>
    </div>
  );
};
