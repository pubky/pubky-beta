'use client';

import React, { MouseEventHandler, useState } from 'react';
import { Icon } from '../Icon';

type CreateButtonProps = {
  ModalComponent: React.FC<{ closeModal: () => void }>;
  width?: string;
  height?: string;
  icon?: React.ReactNode;
  styles?: string;
  className?: string;
};

export const Create = ({
  ModalComponent,
  width = 'w-[96px]',
  height = 'h-[96px]',
  icon = <Icon.Pencil />,
  styles = '',
}: CreateButtonProps) => {
  const [showModal, setShowModal] = useState(false);
  const cssStyle = `${width} ${height} border-[11px] border-fuchsia-500 hover:bg-fuchsia-500 hover:bg-opacity-30 rounded-[96px] flex items-center justify-center cursor-pointer`;

  const handleModal: MouseEventHandler<HTMLButtonElement> = (event) => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <button className={`${cssStyle} ${styles}`} onClick={handleModal}>
        <div
          className={`hover:transition-[transform] hover:duration-[0.3s] hover:ease-[ease] hover:rotate-[20deg]`}
        >
          {icon}
        </div>
      </button>
      {showModal && <ModalComponent closeModal={closeModal} />}
    </>
  );
};
