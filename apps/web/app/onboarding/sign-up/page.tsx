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

import { signup } from '../../api/actions/signup';

export type Profile = {
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
    pic: '/images/Userpic.png',
    links: {
      website: '',
      email: '',
      x: '',
      telegram: '',
    },
  });

  const UploadPic = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, pic: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    console.log(profile);
  };

  return (
    <Onboarding.Layout currentStep={2}>
      <Input.Cursor
        placeholder="Your Name"
        className="h-14 text-[40px] font-bold sm:h-[174px] sm:text-[100px]"
        defaultValue={profile.name}
        autoFocus
        onChange={(e) =>
          setProfile({ ...profile, name: (e.target as HTMLInputElement).value })
        }
      />
      <Typography.PageTitle className="text-opacity-50">
        @1pm3...5jkm
      </Typography.PageTitle>
      <div className="w-full flex-col inline-flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        <Card.Primary title="Profile">
          <Input.Label className="mt-4" value="Short bio" />
          <Card.Primary
            background="bg-white bg-opacity-10"
            className="border border-white border-opacity-10 shadow-[0_4px_8px_0_rgba(0,0,0,0.32)_inset] rounded-lg"
          >
            <Input.TextArea
              placeholder="Short bio. Tell a bit about yourself."
              className="h-[422px]"
              defaultValue={profile.info}
              onChange={(e) => setProfile({ ...profile, info: e.target.value })}
            />
          </Card.Primary>
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
                links: {
                  ...profile.links,
                  website: (e.target as HTMLInputElement).value,
                },
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
                links: {
                  ...profile.links,
                  email: (e.target as HTMLInputElement).value,
                },
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
                links: {
                  ...profile.links,
                  x: (e.target as HTMLInputElement).value,
                },
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
                links: {
                  ...profile.links,
                  telegram: (e.target as HTMLInputElement).value,
                },
              })
            }
          />
        </Card.Primary>
        <Card.Primary title="Picture">
          <label htmlFor="fileInput">
            {profile.pic && (
              <Image
                width={320}
                height={320}
                className="w-80 h-auto mt-6 rounded-full cursor-pointer"
                alt="user"
                src={profile.pic}
              />
            )}
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={UploadPic}
              style={{ display: 'none' }}
            />
          </label>
          <div className="pt-[40px]">
            <Link href="/onboarding/confirm">
              <Button.Large
                onClick={async () => {
                  const { pk, profile: savedProfile } = await signup(profile);
                  console.log({ pk, savedProfile });
                  handleSubmit();
                }}
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
