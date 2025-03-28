'use client';

import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button, Input, Icon, Typography } from '@social/ui-shared';
import { Onboarding } from '../../components';
import { Card } from '../Card';
import { useAlertContext, usePubkyClientContext } from '@/contexts';
import { Links } from '@/types/Post';
import { Utils } from '@social/utils-shared';
import Link from 'next/link';
import { processUserLinks } from './processUserLinks';
import { getFile } from '@/services/fileService';

interface FormErrors {
  [fieldName: string]: string[];
}

const profileSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Minimum length 3 character.' })
    .max(24, { message: 'Maximum length 24 characters' }),
  bio: z.string().max(160, { message: 'Maximum length 160 characters' }).optional()
});

export default function Index() {
  const { pubky, saveProfile } = usePubkyClientContext();
  const { addAlert } = useAlertContext();

  const router = useRouter();

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [image, setImage] = useState<File | string | undefined>();
  const [links, setLinks] = useState<Links[]>([
    { url: '', title: 'website', placeHolder: 'https://' },
    { url: '', title: 'x (twitter)', placeHolder: '@user' }
  ]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    bio: ''
  });
  useEffect(() => {
    addAlert('Add info, your profile is empty.', 'warning');
  }, [pubky]);

  const handleSubmit = async () => {
    if (loading) {
      return;
    }
    try {
      setLoading(true);
      setErrors({
        name: '',
        bio: ''
      });

      const result = profileSchema.safeParse({
        name: name,
        bio: bio ? bio : undefined
      });

      if (!result.success) {
        const newErrors: FormErrors = result.error.flatten().fieldErrors;

        const errorMessages = Object.keys(newErrors).reduce((acc: { [key: string]: string }, key) => {
          acc[key] = newErrors[key].join(', ');
          return acc;
        }, {});

        setErrors((prev) => ({ ...prev, ...errorMessages }));
        return;
      }

      try {
        const { userLinks: linksObject, errors: linkErrors } = processUserLinks(links);

        if (linkErrors.length > 0) {
          const newErrors: FormErrors = {};
          linkErrors.forEach(({ index, message }) => {
            newErrors[`link${index}`] = [message];
          });
          setErrors((prev) => ({ ...prev, ...newErrors }));
          setLoading(false);
          return;
        }

        const response = await saveProfile(name, bio, image, linksObject);
        const imageResponse = response && (await getFile(response.image));
        if (response || (image && imageResponse)) router.push('/home');
      } catch (error) {
        console.log(error);
      } finally {
        router.push('/home');
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Onboarding.Layout currentStep={3}>
      <Input.Cursor
        placeholder="Your Name"
        className="h-auto text-[40px] font-bold sm:h-[106px] sm:text-[64px] placeholder:text-opacity-30"
        defaultValue={name}
        disabled={loading}
        maxLength={24}
        autoCorrect="off"
        error={errors.name}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
      />
      <Typography.H2 variant="light" className="text-[22px] sm:text-2xl leading-tight text-opacity-50 mt-2 sm:mt-0">
        {Utils.minifyPubky(pubky ?? '')}
      </Typography.H2>
      <div className="w-full flex-col inline-flex lg:grid lg:grid-cols-8 gap-6 mt-6">
        <Card.Bio bio={bio} setBio={setBio} errors={errors} />
        <Card.Links links={links} setLinks={setLinks} errors={errors} loading={loading} />
        <Card.Pic image={image} setImage={setImage} />
      </div>
      <div className="w-full max-w-[1200px] mt-6 justify-between gap-6 items-center inline-flex">
        <Link href="/logout">
          <Button.Large
            icon={<Icon.SignOut size="16" />}
            className="w-auto"
            variant="secondary"
            id="onboarding-submit-button"
          >
            Sign out
          </Button.Large>
        </Link>
        <Button.Large
          onClick={!loading ? () => handleSubmit() : undefined}
          icon={<Icon.Check />}
          className="w-auto"
          loading={loading}
          id="onboarding-submit-button"
        >
          Finish
        </Button.Large>
      </div>
    </Onboarding.Layout>
  );
}
