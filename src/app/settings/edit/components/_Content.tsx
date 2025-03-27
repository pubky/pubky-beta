'use client';

import { useEffect, useState } from 'react';
import { Content } from '@social/ui-shared';
import { usePubkyClientContext } from '@/contexts';
import { Utils } from '@social/utils-shared';
import { Links } from '@/types/Post';
import { CardComponent } from '../Cards';
import { Edit } from '.';

export default function Index() {
  const { pubky, profile } = usePubkyClientContext();
  const [handler, setHandler] = useState(pubky);
  const [name, setName] = useState('');
  const [status, setStatus] = useState<string | undefined>('');
  const [image, setImage] = useState<File | string | undefined>(profile?.image);
  const [bio, setBio] = useState('');
  const [prevImage, setPrevImage] = useState<File | string>('');
  const [loading, setLoading] = useState(false);
  const [links, setLinks] = useState<Links[]>([
    { url: '', title: 'website', placeHolder: 'https://' },
    { url: '', title: 'x (twitter)', placeHolder: '@user' }
  ]);
  const [errors, setErrors] = useState({
    name: '',
    bio: ''
  });

  useEffect(() => {
    if (!pubky) return;

    async function fetchData() {
      try {
        if (profile) {
          setHandler(Utils.minifyPubky(pubky ?? ''));
          setName(profile?.name);
          setStatus(profile?.status);
          setBio(profile?.bio || '');
          setImage(profile?.image);
          setPrevImage(profile.image);
          if (profile.links && profile.links.length > 0) setLinks(profile?.links);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pubky]);

  return (
    <Content.Main>
      <Edit.Header />
      <Content.Grid>
        <Edit.UserInfo name={name} setName={setName} handler={handler} errors={errors} loading={loading} />
        <div className="w-full flex-col inline-flex lg:grid lg:grid-cols-8 gap-6 mt-6">
          <CardComponent.Bio bio={bio} setBio={setBio} loading={loading} errors={errors} />
          <CardComponent.Links links={links} setLinks={setLinks} errors={errors} loading={loading} />
          <CardComponent.Pic image={image} setImage={setImage} loading={loading} />
        </div>
        <Edit.Buttons
          image={image}
          prevImage={prevImage}
          loading={loading}
          setLoading={setLoading}
          setErrors={setErrors}
          bio={bio}
          links={links}
          name={name}
          status={status}
        />
      </Content.Grid>
    </Content.Main>
  );
}
