'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Content, Typography } from '@social/ui-shared';
import Image from 'next/image';
import { Post } from '../../components';

export default function Contact() {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <>
      <div className="flex-col lg:flex-row gap-6 inline-flex">
        <Link href="/profile" className="w-full flex-col gap-6 inline-flex">
          <div className="gap-6 inline-flex">
            <div
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="relative"
            >
              <Image
                width={201}
                height={201}
                className="rounded-full"
                src="/images/user.png"
                alt="user-pic"
              />
              {isHovered && (
                <Typography.H2 className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 p-4 rounded-full">
                  John
                </Typography.H2>
              )}
            </div>
            <div className="flex-col gap-6 inline-flex">
              <div className="flex-col gap-1 flex">
                <Typography.Label className="text-opacity-50 leading-none">
                  Tags
                </Typography.Label>
                <Typography.H1 className="leading-[46px]">142</Typography.H1>
              </div>
              <div className="flex-col gap-1 flex">
                <Typography.Label className="text-opacity-50 leading-none">
                  Posts
                </Typography.Label>
                <Typography.H1 className="leading-[46px]">17</Typography.H1>
              </div>
            </div>
          </div>
          <div className="flex-col gap-1 flex">
            <Typography.H2>John Carvalho</Typography.H2>
            <Typography.Label className="text-opacity-50">
              @1Rx3...KO43
            </Typography.Label>
          </div>
        </Link>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Post />
          <Post />
        </div>
      </div>
      <Content.Divider className="my-12" />
    </>
  );
}
