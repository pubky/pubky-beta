/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useRouter } from 'next/navigation';
import { Icon, Typography, Post, SideCard, Button } from '@social/ui-shared';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { minifyPubky } from '../../../libs/pubkyHelper';
import { minifyText } from '../../../libs/textHelper';
import { useClientContext } from '../../../contexts/client';
import { Skeleton } from '../../components';

interface Followers {
  count: number;
  followers: [];
}

export default function Sidebar({
  creatorPubky,
}: {
  creatorPubky?: string | null;
}) {
  const { pubky, follow, unfollow, getProfile, listFollowers, getUser } =
    useClientContext();
  const router = useRouter();
  const [name, setName] = useState('');
  const [bio, setBio] = useState('No bio.');
  const [telegram, setTelegram] = useState('');
  const [x, setX] = useState('');
  const [website, setWebsite] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState('/images/Userpic.png');
  const [loading, setLoading] = useState(true);
  const [loadingFollowers, setLoadingFollowers] = useState(true);
  const [followers, setFollowers] = useState<Followers | null>(null);
  const [images, setImages] = useState<{ alt: string; src: string }[]>([]);
  const [followed, setFollowed] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        let pubkey = creatorPubky;

        if (!pubkey) {
          pubkey = pubky;
        }

        if (!pubkey) return;

        const followers = await listFollowers(pubkey);

        if (followers) {
          setImages(
            followers.followers.map((user: any) => ({
              alt: 'user-pic',
              src: user.profile.image,
            }))
          );
          setFollowers(followers);
          setLoadingFollowers(false);

          followers.followers.forEach((user: any) => {
            const uri = user.uri.replace('pubky:', '');
            if (uri === pubky) {
              setFollowed(true);
            }
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [pubky, followed, listFollowers, creatorPubky]);

  useEffect(() => {
    async function fetchData() {
      try {
        let profile = null;
        if (creatorPubky) {
          profile = await getUser(creatorPubky);
        } else {
          ({ profile } = await getProfile());
        }
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
            const email = profile.links.find(
              (link: { title: string }) => link.title === 'email'
            );
            setX(x?.url || '');
            setWebsite(website?.url || '');
            setTelegram(telegram?.url || '');
            setEmail(email?.url || '');
          }
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [pubky, getProfile, getUser, creatorPubky]);

  const followUser = async () => {
    try {
      if (!creatorPubky) return;

      const result = await follow(creatorPubky);
      setFollowed(result);
    } catch (error) {
      console.log(error);
    }
  };

  const unfollowUser = async () => {
    try {
      if (!creatorPubky) return;

      const result = await unfollow(creatorPubky);
      setFollowed(!result);
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
                className="w-[32px] h-[32px] rounded-full"
                src={image}
                alt="user-pic"
              />
              <Typography.H2>{minifyText(name)}</Typography.H2>
            </div>
            <Typography.Label className="text-opacity-50">
              {pubky ? minifyPubky(pubky) : 'Loading...'}
            </Typography.Label>
            <Typography.Body
              variant="medium"
              className="text-opacity-80 break-all"
            >
              {minifyText(bio, 140)}
            </Typography.Body>{' '}
            {followed ? (
              <Button.Medium
                onClick={() => unfollowUser()}
                variant="default"
                icon={<Icon.UserMinus size="16" />}
                className={!creatorPubky ? 'hidden' : ''}
              >
                Unfollow me
              </Button.Medium>
            ) : (
              <Button.Medium
                onClick={() => followUser()}
                variant="default"
                icon={<Icon.UserPlus size="16" />}
                className={!creatorPubky ? 'hidden' : ''}
              >
                Follow me
              </Button.Medium>
            )}
          </SideCard.Content>
        </div>
      )}
      {/**<div>
        <SideCard.Header title="Tagged as" variantTitle="label" />
        <SideCard.Content>
          <div className="flex-col gap-3 inline-flex">
            <Post.Footer className="mt-0">
              <PostUtil.Tag clicked color="amber">
                #Bitcoin
              </PostUtil.Tag>
              <Button.Action
                variant="custom"
                size="small"
                icon={<Icon.Plus />}
              />
              <PostUtil.Counter counter={0} />
             <Post.UserPic images={images} />
            </Post.Footer>
          </div>
        </SideCard.Content>
      </div> */}
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
                <Post.UserPic images={images} />
              </div>
            </Link>
          </SideCard.Content>
        ) : (
          <SideCard.Content>
            <div
              onClick={(event) => {
                event.stopPropagation();
                (followers?.count ?? 0) > 0 &&
                  router.push(`/followers/${creatorPubky ? creatorPubky : ''}`);
              }}
              className={`flex-col gap-3 inline-flex ${
                (followers?.count ?? 0) > 0 && 'cursor-pointer'
              }`}
            >
              <div className="inline-flex gap-2">
                <Typography.Label>{followers?.count}</Typography.Label>
                <Typography.Label className="text-opacity-50">
                  Followers
                </Typography.Label>
              </div>
              <Post.UserPic images={images} />
            </div>
          </SideCard.Content>
        )}
      </div>
      {(x || website || telegram) && (
        <div className="w-full">
          <SideCard.Header title="Links" variantTitle="label" />
          <div className="gap-4 grid grid-cols-4 w-full">
            {website && (
              <Link target="_blank" href={website} className="w-full">
                <SideCard.Content className="w-full h-24 justify-center items-center">
                  <Icon.Globe />
                </SideCard.Content>
              </Link>
            )}
            {email && (
              <Link target="_blank" href={`mailto:${email}`} className="w-full">
                <SideCard.Content className="w-full h-24 justify-center items-center">
                  <Icon.Envelope />
                </SideCard.Content>
              </Link>
            )}
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
