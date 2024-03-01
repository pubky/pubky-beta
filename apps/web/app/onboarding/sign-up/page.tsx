'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Content,
  Typography,
  Button,
  Input,
  Card,
  Icon,
} from '@social/ui-shared';
import { Onboarding } from '../components';

type Profile = {
  name: string;
  info: string;
  pic: string;
  links: {
    website: string;
    email: string;
    x: string;
    telegram: string;
  };
};

export default function Index() {
  const [profile, setProfile] = useState<Profile>({
    name: '',
    info: '',
    pic: '',
    links: {
      website: '',
      email: '',
      x: '',
      telegram: '',
    },
  });

  const handleSubmit = () => {
    console.log(profile);
  };

  return (
    <Onboarding.Layout currentStep={2}>
      <Input.Cursor
        placeholder="Your Name"
        className="h-[174px] text-[100px] font-bold"
        defaultValue={profile.name}
        autoFocus
        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
      />
      <Typography.PageTitle className="text-opacity-50">
        @1pm3...5jkm
      </Typography.PageTitle>
      <div className="grid grid-cols-3 gap-6 mt-12">
        <Card.Primary title="Profile">
          <Input.Label className="mt-4" value="Short bio" />
          <Input.TextArea
            placeholder="Short bio. Tell a bit about yourself."
            className="h-[422px]"
            defaultValue={profile.info}
            onChange={(e) => setProfile({ ...profile, info: e.target.value })}
          />
        </Card.Primary>
        <Card.Primary title="Links">
          <Input.Label className="mt-4" value="Website" />
          <Input.Text
            className="h-[70px]"
            placeholder="https://"
            defaultValue={profile.links.website}
            onChange={(e) =>
              setProfile({
                ...profile,
                links: { ...profile.links, website: e.target.value },
              })
            }
          />

          <Input.Label className="mt-4" value="Email" />
          <Input.Text
            className="h-[70px]"
            placeholder="user@provider.com"
            defaultValue={profile.links.email}
            onChange={(e) =>
              setProfile({
                ...profile,
                links: { ...profile.links, email: e.target.value },
              })
            }
          />

          <Input.Label className="mt-4" value="x (twitter)" />
          <Input.Text
            className="h-[70px]"
            placeholder="@user"
            defaultValue={profile.links.x}
            onChange={(e) =>
              setProfile({
                ...profile,
                links: { ...profile.links, x: e.target.value },
              })
            }
          />

          <Input.Label className="mt-4" value="telegram" />
          <Input.Text
            className="h-[70px]"
            placeholder="@user"
            defaultValue={profile.links.telegram}
            onChange={(e) =>
              setProfile({
                ...profile,
                links: { ...profile.links, telegram: e.target.value },
              })
            }
          />
        </Card.Primary>
        <Card.Primary title="Picture">
          <Image
            width={320}
            height={320}
            className="mt-6"
            alt="user"
            src="/images/Userpic.png"
          />
          <div className="pt-[40px]">
            <Link href="/home">
              <Button.Large
                onClick={() => handleSubmit()}
                icon={<Icon.Check />}
              >
                Finish
              </Button.Large>
            </Link>
          </div>
        </Card.Primary>
        <Content.MainBg alt="Onboard Pubky" imgSrc="/images/bg-image-2.png" />
      </div>
    </Onboarding.Layout>
  );
}
