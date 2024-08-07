import { useEffect, useState } from 'react';
import { Button, Icon, Input, Typography } from '@social/ui-shared';
import { useAlertContext, useClientContext } from '@/contexts';
import { IService, IUserProfile } from '@/types';
import DropDown from '@/components/DropDown';
import { Skeleton } from '@/components';
import Modal from '@/components/Modal';

export default function Wallet() {
  const { pubky, getUserIndexed, updateWalletServices } = useClientContext();
  const { setContent, setShow } = useAlertContext();
  const [profile, setProfile] = useState<IUserProfile>();
  const [services, setServices] = useState<IService[]>([]);
  const [lnAddress, setLnAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [modalService, setModalService] = useState(false);
  const [openServiceId, setOpenServiceId] = useState<number | null>(null);
  const [loadingServices, setLoadingServices] = useState(false);

  const validateLNAddress = (address: string) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(address);
  };

  const handleSubmit = () => {
    if (lnAddress === '') {
      updateWalletServices('');
      setContent('Lightning Address removed');
      setShow(true);
      setError(false);
      return;
    }
    if (!validateLNAddress(lnAddress)) {
      setError(true);
      return;
    }
    updateWalletServices(lnAddress);
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

  useEffect(() => {
    if (profile?.profile.ln_address) setLnAddress(profile?.profile.ln_address);
  }, [profile?.profile.ln_address]);

  useEffect(() => {
    if (profile?.profile.services) setServices(profile?.profile.services);
  }, [profile?.profile.services]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const toggleServiceOpen = (index: number) => {
    setOpenServiceId(openServiceId === index ? null : index);
  };

  const removeService = (index: number) => {
    const updatedServicesUser = services.filter((_, i) => i !== index);
    setServices(updatedServicesUser);
    updateWalletServices(lnAddress, updatedServicesUser);
  };

  const handleSubmitServices = async () => {
    setLoadingServices(true);
    try {
      if (services) {
        await updateWalletServices(lnAddress, services);
        setContent('Services updated!');
        setShow(true);
      }
    } catch (error) {
      console.error('Failed to update services', error);
      setContent('Failed to update services', 'warning');
      setShow(true);
    } finally {
      setLoadingServices(false);
    }
  };

  return (
    <div className="px-12 pt-12 bg-white bg-opacity-10 rounded-2xl flex-col justify-start items-start gap-12 inline-flex">
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
                className={`${
                  error && 'mb-2'
                } rounded-full p-2 bg-white bg-opacity-10 hover:bg-opacity-20 cursor-pointer`}
                onClick={() => handleSubmit()}
              >
                <Icon.Plus size="16" />
              </div>
            }
          />
        )}
      </div>
      <div className="w-full flex-col justify-start items-start gap-6 flex">
        <div className="justify-start items-center gap-2 inline-flex">
          <Icon.Product size="24" />
          <Typography.H2>Products & Services</Typography.H2>
        </div>
        <div className="w-full">
          <Typography.Body variant="medium" className="text-opacity-80">
            Add your products/services so that users can purchase them from you.
          </Typography.Body>
          <Button.Transparent
            className="mt-2 w-auto"
            icon={
              <Icon.Product
                size="16"
                color={services.length > 5 ? 'gray' : 'white'}
              />
            }
            onClick={
              services.length > 5 ? undefined : () => setModalService(true)
            }
          >
            Add product/service
          </Button.Transparent>
          <div className="mt-4 flex-col gap-4 inline-flex w-full">
            {loading ? (
              <Skeleton.Simple />
            ) : (
              services.map((service, index) => (
                <DropDown.Service
                  key={index}
                  title={service.title}
                  contact={service.contact}
                  price={service.price}
                  description={service.description}
                  open={openServiceId === index}
                  setOpen={() => toggleServiceOpen(index)}
                  removeService={() => removeService(index)}
                />
              ))
            )}
          </div>
          {services.length > 0 && (
            <div className="w-full flex justify-end mt-4">
              <Button.Large
                icon={<Icon.Check size="16" />}
                className="w-auto h-[40px]"
                onClick={handleSubmitServices}
                loading={loadingServices}
              >
                Save
              </Button.Large>
            </div>
          )}
        </div>
      </div>
      <Modal.Service
        services={services}
        setServices={setServices}
        showModal={modalService}
        setShowModal={setModalService}
      />
    </div>
  );
}
