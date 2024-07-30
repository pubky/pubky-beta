import { useEffect, useState } from 'react';
import { Icon, Input, Typography } from '@social/ui-shared';
import { useAlertContext, useClientContext } from '@/contexts';
import { IUserProfile } from '@/types';
import { Skeleton } from '@/components';

export default function Wallet() {
  const { pubky, getUserIndexed, updateLNAddress } = useClientContext();
  const { setContent, setShow } = useAlertContext();
  const [profile, setProfile] = useState<IUserProfile>();
  const [lnAddress, setLnAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const validateLNAddress = (address: string) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(address);
  };

  const handleSubmit = () => {
    if (!validateLNAddress(lnAddress)) {
      setError(true);
      return;
    }
    updateLNAddress(lnAddress);
    setContent('Lightning Address added successfully!');
    setShow(true);
    setError(false);
  };

  async function fetchProfile() {
    try {
      if (!pubky) return;
      const userProfile = await getUserIndexed(pubky);

      if (userProfile) {
        setProfile(userProfile);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="p-12 bg-white bg-opacity-10 rounded-2xl flex-col justify-start items-start gap-12 inline-flex">
      <div className="w-full flex-col justify-start items-start gap-6 flex">
        <div className="justify-start items-center gap-2 inline-flex">
          <Icon.Wallet size="24" />
          <Typography.H2>Wallet</Typography.H2>
        </div>
        <Typography.Body variant="medium" className="text-opacity-80">
          Enter your lightning address to receive payments on your Pubky
          profile.
        </Typography.Body>
        {loading ? (
          <Skeleton.Simple />
        ) : (
          <Input.Text
            className="h-[70px]"
            placeholder={'Add lightning address'}
            onKeyDown={handleKeyDown}
            defaultValue={profile?.profile.ln_address}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setLnAddress(e.target.value);
              if (error) setError(false);
            }}
            error={error ? 'Invalid lightning address' : ''}
            action={
              <div
                className="rounded-full p-2 bg-white bg-opacity-10 hover:bg-opacity-20 cursor-pointer"
                onClick={() => handleSubmit()}
              >
                <Icon.Plus size="16" />
              </div>
            }
          />
        )}
      </div>
    </div>
  );
}
