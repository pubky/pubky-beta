import { useEffect, useState } from 'react';
import { Button, Icon, Typography } from '@social/ui-shared';
import { useClientContext } from '@/contexts';
import { IService, IUserProfile } from '@/types';
import { Skeleton } from '@/components';
import Modal from '@/components/Modal';
import DropDown from '@/components/DropDown';

export default function ProductsServices() {
  const { pubky, getUserIndexed, updateServices } = useClientContext();
  const [services, setServices] = useState<IService[]>([]);
  const [profile, setProfile] = useState<IUserProfile>();
  const [loading, setLoading] = useState(true);
  const [modalService, setModalService] = useState(false);
  const [openServiceId, setOpenServiceId] = useState<number | null>(null);

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
    if (profile?.profile?.services) setServices(profile?.profile.services);
  }, [profile?.profile?.services]);

  const toggleServiceOpen = (index: number) => {
    setOpenServiceId(openServiceId === index ? null : index);
  };

  const removeService = (index: number) => {
    const updatedServicesUser = services.filter((_, i) => i !== index);
    setServices(updatedServicesUser);
    updateServices(updatedServicesUser);
  };

  return (
    <div className="px-12 pt-12 bg-white bg-opacity-10 rounded-2xl flex-col justify-start items-start gap-12 inline-flex">
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
