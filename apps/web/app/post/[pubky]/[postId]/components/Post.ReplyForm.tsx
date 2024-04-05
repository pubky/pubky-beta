'use client';

import { useEffect, useState } from 'react';
import {
  Icon,
  Button,
  // PostUtil,
  Post,
  Typography,
  Input,
} from '@social/ui-shared';
import { useClientContext } from '../../../../../contexts/client';
import { minifyPubky } from '../../../../../libs/pubkyHelper';
import { minifyText } from '../../../../../libs/textHelper';

export default function ReplyForm() {
  const { getProfile, pubky } = useClientContext();
  const [username, setUsername] = useState('');
  const [image, setImage] = useState('/images/Userpic.png');
  const [pk, setPk] = useState<string | null>('');

  useEffect(() => {
    async function fetchData() {
      const profile = await getProfile();
      if (profile) {
        setImage(profile.image);
        setUsername(profile.name);
        setPk(minifyPubky(pubky));
      }
    }
    fetchData();
  }, [getProfile, pubky]);

  return (
    <Post.Root>
      <Post.MainCard className="w-full p-12 bg-transparent border border-opacity-30 border-dashed">
        <div className="justify-between block lg:inline-flex">
          <div>
            <Post.Header>
              <div className="justify-start items-center gap-4 flex">
                <Post.ImageUser
                  className="lg:w-12 lg:h-12"
                  src={image}
                  alt="user"
                />
                <Post.Username className="lg:text-2xl">
                  {minifyText(username, 24)}
                </Post.Username>
                {pk && (
                  <div className="hidden items-center gap-1 sm:inline-flex">
                    <Typography.Label className="text-opacity-30">
                      {pk}
                    </Typography.Label>
                    <Icon.CheckCircle />
                  </div>
                )}
              </div>
            </Post.Header>
            <Post.Content>
              <Input.CursorArea
                className="text-2xl h-8"
                placeholder="Post your reply"
              />
            </Post.Content>
            <Button.Medium
              className="w-[111px] mt-6"
              icon={<Icon.ChatCircleText />}
            >
              Reply
            </Button.Medium>
          </div>
          <div className="flex-col gap-3 inline-flex mt-6 lg:mt-0">
            <div className="gap-1 items-center inline-flex">
              <Icon.Tag color="gray" />
              <Typography.Label className="text-opacity-30">
                TAGS
              </Typography.Label>
            </div>
            <Post.Footer className="mt-4">
              {/* <PostUtil.Tag clicked color="amber">
                #Bitcoin
              </PostUtil.Tag> */}
              <Button.Action
                variant="custom"
                size="small"
                icon={<Icon.Tag />}
              />
            </Post.Footer>
          </div>
        </div>
      </Post.MainCard>
    </Post.Root>
  );
}
