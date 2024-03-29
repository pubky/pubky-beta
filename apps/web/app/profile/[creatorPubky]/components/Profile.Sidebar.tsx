/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {
  Icon,
  PostUtil,
  Button,
  Typography,
  Post,
  SideCard,
} from '@social/ui-shared';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { minifyPubky } from '../../../../libs/pubkyHelper';
import { useClientContext } from '../../../../contexts/client';
import { Skeleton } from '../../../components';

interface Followers {
  count: number;
  followers: [];
}

export default function Sidebar({ creatorPubky }: { creatorPubky: string }) {
  const { getUser, listFollowers, follow } = useClientContext();

  const [name, setName] = useState('');
  const [bio, setBio] = useState('No bio.');
  const [telegram, setTelegram] = useState('');
  const [x, setX] = useState('');
  const [website, setWebsite] = useState('');
  const [image, setImage] = useState('/images/Userpic.png');
  const [loading, setLoading] = useState(true);
  const [loadingFollowers, setLoadingFollowers] = useState(true);
  const [followers, setFollowers] = useState<Followers | null>(null);
  const [images, setImages] = useState<{ alt: string; src: string }[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const followers = await listFollowers(creatorPubky);

        if (followers) {
          setImages(
            followers.followers.map((user: any) => ({
              alt: 'user-pic',
              src: user.profile.image,
            }))
          );
          setFollowers(followers);
          setLoadingFollowers(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [creatorPubky, listFollowers]);

  useEffect(() => {
    async function fetchData() {
      try {
        const profile = await getUser(creatorPubky);

        if (profile) {
          setName(profile?.name || '');
          setBio(profile?.bio || 'No bio.');
          setImage(profile?.image || '/images/Userpic.png');

          if (profile.links) {
            const x = profile.links.find(
              (link: { title: string }) => link.title === 'x'
            );

            const website = profile.links.find(
              (link: { title: string }) => link.title === 'website'
            );

            const telegram = profile.links.find(
              (link: { title: string }) => link.title === 'telegram'
            );

            setX(x?.url || '');
            setWebsite(website?.url || '');
            setTelegram(telegram?.url || '');
          }

          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [creatorPubky, getUser]);

  const followUser = async () => {
    try {
      if (!creatorPubky) return;

      await follow(creatorPubky);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="hidden flex-col justify-start items-start gap-6 xl:inline-flex">
      {loading ? (
        <Skeleton.ProfileSidebar />
      ) : (
        <div>
          <SideCard.Header title="profile" variantTitle="label" />
          <SideCard.Content className="flex-col gap-3 inline-flex">
            <div className="justify-start items-center gap-3 inline-flex">
              <Image
                width={32}
                height={32}
                className="rounded-full"
                src={image}
                alt="user-pic"
              />
              <Typography.H2>{name}</Typography.H2>
            </div>
            <Typography.Label className="text-opacity-50">
              {creatorPubky ? minifyPubky(creatorPubky) : 'Loading...'}
            </Typography.Label>
            <Typography.Body variant="medium" className="text-opacity-80">
              {bio}
            </Typography.Body>
            <Button.Medium
              onClick={() => followUser()}
              variant="default"
              icon={<Icon.UserPlus size="16" />}
            >
              Follow me
            </Button.Medium>
          </SideCard.Content>
        </div>
      )}
      <div>
        <SideCard.Header title="Tagged as" variantTitle="label" />
        <SideCard.Content>
          <div className="flex-col gap-3 inline-flex">
            <Post.Footer className="mt-0">
              {/* <PostUtil.Tag clicked color="amber">
                #Bitcoin
              </PostUtil.Tag> */}
              <Button.Action
                variant="custom"
                size="small"
                icon={<Icon.Plus />}
              />
              <PostUtil.Counter counter={0} />
              {/* <Post.UserPic images={images} /> */}
            </Post.Footer>
          </div>
        </SideCard.Content>
      </div>
      <div>
        <SideCard.Header title="Contacts" variantTitle="label" />
        {loadingFollowers ? (
          <SideCard.Content>
            <Link href="/followers">
              <div className="flex-col gap-3 inline-flex">
                <div className="inline-flex gap-2">
                  <Typography.Label>{followers?.count}</Typography.Label>
                  <Typography.Label className="text-opacity-50">
                    Followers
                  </Typography.Label>
                </div>
              </div>
            </Link>
          </SideCard.Content>
        ) : (
          <SideCard.Content>
            <Link href="/followers">
              <div className="flex-col gap-3 inline-flex">
                <div className="inline-flex gap-2">
                  <Typography.Label>{followers?.count}</Typography.Label>
                  <Typography.Label className="text-opacity-50">
                    Followers
                  </Typography.Label>
                </div>

                <Post.UserPic images={images} />
              </div>
            </Link>
          </SideCard.Content>
        )}
      </div>
      {(x || website || telegram) && (
        <div className="w-full">
          <SideCard.Header title="Links" variantTitle="label" />
          <div className="gap-4 grid grid-cols-3 w-full">
            {x && (
              <Link
                target="_blank"
                href={`https://x.com/${x}`}
                className="w-full"
              >
                <SideCard.Content className="w-full h-24 justify-center items-center">
                  <Icon.Twitter />
                </SideCard.Content>
              </Link>
            )}
            {website && (
              <Link target="_blank" href={website} className="w-full">
                <SideCard.Content className="w-full h-24 justify-center items-center">
                  <Icon.Youtube />
                </SideCard.Content>
              </Link>
            )}
            {telegram && (
              <Link
                target="_blank"
                href={`https://t.me/${telegram}`}
                className="w-full"
              >
                <SideCard.Content className="w-full h-24 justify-center items-center">
                  <Icon.Telegram />
                </SideCard.Content>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
