'use client';

import { IService } from '@/types';
import { Icon, Input, Modal } from '@social/ui-shared';
import { useEffect, useRef, useState } from 'react';

interface ServiceProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  services: IService[];
  setServices: React.Dispatch<React.SetStateAction<IService[]>>;
}

export default function Service({
  showModal,
  setShowModal,
  services,
  setServices,
}: ServiceProps) {
  const modalLinkRef = useRef<HTMLDivElement>(null);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [contact, setContact] = useState('');
  const [description, setDescription] = useState('');
  const disabled = !title || !price || !contact || !description;

  useEffect(() => {
    const handleClickOutsideModal = (event: MouseEvent) => {
      if (
        modalLinkRef.current &&
        !modalLinkRef.current.contains(event.target as Node)
      ) {
        setShowModal(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutsideModal);

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideModal);
    };
  }, [modalLinkRef, setShowModal]);

  const handleAddService = () => {
    const newService = {
      title,
      price,
      contact,
      description,
    };

    const existingServices = services;

    const servicesArray = Array.isArray(existingServices)
      ? existingServices
      : [];

    const updatedServicesUser = [...servicesArray, newService];

    //updateServices(updatedServicesUser);

    setServices(updatedServicesUser);
    setTitle('');
    setPrice('');
    setContact('');
    setDescription('');
    setShowModal(false);
  };

  return (
    <Modal.Root
      show={showModal}
      closeModal={() => setShowModal(false)}
      modalRef={modalLinkRef}
      className="w-[592px] h-auto max-h-[650px] justify-start"
    >
      <Modal.CloseAction onClick={() => setShowModal(false)} />
      <Modal.Header title="Add Product/Service" />

      <div className="my-6 flex-col inline-flex gap-4">
        <div className="w-full flex gap-6">
          <div>
            <Input.Label value="Title" />
            <Input.Text
              placeholder="Add title"
              className="mt-1 h-[50px]"
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setTitle(e.target.value)
              }
            />
          </div>
          <div>
            <Input.Label value="BTC" />
            <Input.Text
              placeholder="How many bitcoin?"
              className="mt-1 h-[50px]"
              value={price}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPrice(e.target.value)
              }
            />
          </div>
        </div>
        <div>
          <Input.Label value="Contact" />
          <Input.Text
            placeholder="Add a contact method"
            className="mt-1 h-[50px]"
            value={contact}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setContact(e.target.value)
            }
          />
        </div>
        <div>
          <Input.Label value="Description" />
          <div className="p-8 rounded-2xl bg-transparent border border-white border-opacity-30 border-dashed mt-1">
            <Input.TextArea
              placeholder="Add description"
              defaultValue={description}
              maxLength={160}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setDescription(e.target.value)
              }
            />
          </div>
        </div>
      </div>
      <div className="w-full mt-4">
        <Modal.SubmitAction
          icon={<Icon.Product size="16" color={!disabled ? 'white' : 'gray'} />}
          onClick={!disabled ? handleAddService : undefined}
          disabled={disabled}
        >
          Add product/service
        </Modal.SubmitAction>
      </div>
    </Modal.Root>
  );
}
