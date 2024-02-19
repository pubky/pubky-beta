'use client';

import React, { useState, MouseEventHandler } from 'react';
import { Icon } from '../Icon';
import { Modal } from '../Modal';

type CreateButtonProps = {
  modal?: RF<Modal>;
  width?: string;
  height?: string;
  styles?: string;
  className?: string;
};

export const Create = ({
  modal,
  width = 'w-[96px]',
  height = 'h-[96px]',
  styles = '',
}: CreateButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const cssStyle = `${width} ${height} border-[11px] border-fuchsia-500 hover:bg-fuchsia-500 hover:bg-opacity-30 rounded-[96px] flex items-center justify-center cursor-pointer`;
  const pencilStyle =
    isHovered &&
    'transition-[transform] duration-[0.3s] ease-[ease] rotate-[20deg]';

  const handleModal: MouseEventHandler<HTMLButtonElement> = (event) => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <button
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`${cssStyle} ${styles}`}
        onClick={handleModal}
      >
        <div className={`${pencilStyle}`}>
          <Icon.Pencil />
        </div>
      </button>
      {showModal && <modal closeModal={closeModal} />}
    </>
  );
};
