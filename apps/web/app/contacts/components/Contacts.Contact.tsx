'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Content, Typography } from '@social/ui-shared';
import Image from 'next/image';
import { Post, PostsLayout } from '../../components';
import { minifyPubky } from '../../../libs/pubkyHelper';
import { useClientContext } from '../../../contexts/client';
import { IPost } from '../../../types';

interface ContactsProps extends React.HTMLAttributes<HTMLDivElement> {
  contacts?: Array<{
    profile: {
      name: string;
      image: string;
      bio: string;
    };
    uri: string;
  }>;
  cursor: string;
  count: string;
}

export default function Contact({ contacts, cursor, count }: ContactsProps) {
  const { listUserFeed } = useClientContext();
  const [isHovered, setIsHovered] = useState(false);
  const [posts, setPosts] = useState<IPost[]>([]);

  useEffect(() => {
    async function fetchPosts() {
      if (contacts) {
        for (const contact of contacts) {
          const postUris = await listUserFeed(
            contact.uri.replace('pubky:', ''),
            cursor
          );
          setPosts(postUris.feed);
        }
      }
    }
    fetchPosts();
  }, [contacts, listUserFeed, cursor]);

  return (
    <>
      {contacts &&
        contacts.map((contact, index) => (
          <>
            <div key={index} className="flex-col lg:flex-row gap-6 inline-flex">
              <Link
                href={`/profile/${contact.uri.replace('pubky:', '')}`}
                className="w-full flex-col gap-6 inline-flex"
              >
                <div className="gap-6 inline-flex">
                  <div
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className="relative"
                  >
                    <Image
                      width={201}
                      height={201}
                      className="rounded-full w-[201px] h-[201px]"
                      src={contact.profile.image}
                      alt={`contact-pic-${index + 1}`}
                    />
                    {isHovered && (
                      <Typography.H2 className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 p-4 rounded-full">
                        {contact.profile.name}
                      </Typography.H2>
                    )}
                  </div>
                  <div className="flex-col gap-6 inline-flex">
                    <div className="flex-col gap-1 flex">
                      {/**
                      <Typography.Label className="text-opacity-50 leading-none">
                        Tags
                      </Typography.Label>
                      <Typography.H1 className="leading-[46px]">
                        17
                      </Typography.H1>
                       */}
                    </div>
                    <div className="flex-col gap-1 flex">
                      <Typography.Label className="text-opacity-50 leading-none">
                        Posts
                      </Typography.Label>
                      <Typography.H1 className="leading-[46px]">
                        {count}
                      </Typography.H1>
                    </div>
                  </div>
                </div>
                <div className="flex-col gap-1 flex">
                  <Typography.H2>{contact.profile.name}</Typography.H2>
                  <Typography.Label className="text-opacity-50">
                    {minifyPubky(contact.uri.replace('pubky:', ''))}
                  </Typography.Label>
                </div>
              </Link>
              <PostsLayout className="flex flex-col gap-6">
                {posts.map((post, index) => (
                  <Post key={index} post={post} />
                ))}
              </PostsLayout>
            </div>
            {index !== contacts.length - 1 && <Content.Divider />}
          </>
        ))}
    </>
  );
}
