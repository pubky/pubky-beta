'use client';

import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button, Input, Icon, Typography } from '@social/ui-shared';
import { usePubkyClientContext } from '@/contexts';
import { Onboarding } from '../../components';
import { Card } from '../Card';
import { Links } from '@/types/Post';
import { processUserLinks } from '../../register/components/processUserLinks';
import { Utils } from '@/components/utils-shared';

interface FormErrors {
  [fieldName: string]: string[];
}

const profileSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Minimum length 3 character.' })
    .max(24, { message: 'Maximum length 24 characters' }),
  token: z.string().refine((val) => val.length === 14, {
    message: 'Invite code must be 14 characters.'
  }),
  bio: z.string().max(160, { message: 'Maximum length 160 characters' }).optional()
});

export default function Index() {
  const { signUp, profile } = usePubkyClientContext();
  const router = useRouter();

  const [name, setName] = useState(profile?.name || '');
  const [token, setToken] = useState('');
  const [bio, setBio] = useState(profile?.bio || '');
  const [image, setImage] = useState<File | string | undefined>();
  const [links, setLinks] = useState<Links[]>([
    { url: '', title: 'website', placeHolder: 'https://' },
    { url: '', title: 'x (twitter)', placeHolder: '@user' }
  ]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({ name: '', token: '', bio: '' });
  const iconInviteCode = errors.token ? (
    <Icon.XCircle size="26" color="#FF0000" />
  ) : success ? (
    <Icon.CheckCircle size="26" color="#C8FF00" />
  ) : (
    <Icon.LockKey size="26" />
  );

  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = Utils.inviteCodeMask(e.target.value);
    setToken(maskedValue);
  };

  const handleSubmit = async () => {
    if (loading) {
      return;
    }
    try {
      setLoading(true);
      setErrors({ name: '', token: '', bio: '' });

      const result = profileSchema.safeParse({ name: name, token: token, bio: bio ? bio : undefined });

      if (!result.success) {
        const newErrors: FormErrors = result.error.flatten().fieldErrors;

        const errorMessages = Object.keys(newErrors).reduce((acc: { [key: string]: string }, key) => {
          acc[key] = newErrors[key].join(', ');
          return acc;
        }, {});

        setErrors((prev) => ({ ...prev, ...errorMessages }));
        setLoading(false);
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

        const signUpResponse = await signUp(name, token, bio, linksObject, image);

        if ('state' in signUpResponse && !signUpResponse.state) {
          const errorMessage = signUpResponse.error.includes('Error message:')
            ? signUpResponse.error.split('Error message:')[1].trim()
            : signUpResponse.error;
          setErrors((prev) => ({ ...prev, token: errorMessage }));
          throw new Error('Something went wrong');
        }
        router.push('/onboarding/pubky');
        setSuccess(true);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <Onboarding.Layout currentStep={2}>
      <div className="w-full flex flex-col gap-4 lg:flex-row justify-between">
        <div>
          <Input.Cursor
            placeholder="Your Name"
            className="h-auto text-[40px] font-bold sm:h-[106px] sm:text-[64px] placeholder:text-opacity-30"
            defaultValue={name}
            disabled={loading}
            maxLength={30}
            autoFocus
            id="onboarding-name-input"
            autoCorrect="off"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            error={errors.name}
          />
          <Typography.Body variant="large" className="text-[22px] sm:text-2xl leading-tight text-opacity-50">
            Enter your name, invite code, bio, add links, and upload a user picture.
          </Typography.Body>
        </div>
        <div className="flex flex-col lg:justify-self-end lg:mt-4">
          <Input.Text
            icon={iconInviteCode}
            value={token}
            disabled={loading || success}
            maxLength={14}
            id="onboarding-token-input"
            autoCorrect="off"
            onChange={handleTokenChange}
            error={errors.token}
            className={`${success && 'border-[#C8FF00] text-[#C8FF00]'} border-opacity-100 h-auto lg:w-[280px] pl-16 pr-6 py-5 uppercase placeholder:text-opacity-40 text-opacity-100 text-[17px]`}
            placeholder="Invite code"
          />
        </div>
      </div>
      <div className="w-full flex-col inline-flex lg:grid lg:grid-cols-8 gap-6 mt-6">
        <Card.Bio bio={bio} setBio={setBio} errors={errors} loading={loading} />
        <Card.Links links={links} setLinks={setLinks} errors={errors} loading={loading} />
        <Card.Pic image={image} setImage={setImage} loading={loading} />
        {/**<Content.MainBg alt="Onboard Pubky" imgSrc="/images/webp/bg-image-2.webp" />*/}
      </div>
      <div className="w-full max-w-[1200px] mt-6 justify-between items-center inline-flex">
        <Link href="/onboarding/sign-in">
          <Button.Large icon={<Icon.ArrowLeft />} className="w-auto" variant="secondary">
            Back
          </Button.Large>
        </Link>
        <Button.Large
          onClick={!loading ? () => handleSubmit() : undefined}
          icon={<Icon.ArrowRight />}
          className="w-auto"
          loading={loading}
          id="onboarding-submit-button"
        >
          Continue
        </Button.Large>
      </div>
    </Onboarding.Layout>
  );
}
