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
import { minifyPubky } from '../../../libs/pubkyHelper';
import { useClientContext } from '../../../contexts/client';
import { Skeleton } from '../../components';

export default function Sidebar() {
  const { pubky, getProfile } = useClientContext();

  const [name, setName] = useState('');
  const [bio, setBio] = useState('No bio.');
  const [telegram, setTelegram] = useState('');
  const [x, setX] = useState('');
  const [website, setWebsite] = useState('');
  const [image, setImage] = useState('/images/Userpic.png');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const profile = await getProfile();
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
  }, [pubky, getProfile]);

  // const images = [
  //   {
  //     src: '/images/user.png',
  //     alt: '1',
  //   },
  //   {
  //     src: '/images/user.png',
  //     alt: '2',
  //   },
  //   {
  //     src: '/images/user.png',
  //     alt: '3',
  //   },
  // ];

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
              {pubky ? minifyPubky(pubky) : 'Loading...'}
            </Typography.Label>
            <Typography.Body variant="medium" className="text-opacity-80">
              {bio}
            </Typography.Body>
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
        <SideCard.Content>
          <Link href="/followers">
            <div className="flex-col gap-3 inline-flex">
              <div className="inline-flex gap-2">
                <Typography.Label>0</Typography.Label>
                <Typography.Label className="text-opacity-50">
                  Followers
                </Typography.Label>
              </div>
              {/* <Post.UserPic images={images} /> */}
            </div>
          </Link>
        </SideCard.Content>
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
                href={`https://telegram.com/${telegram}`}
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
