import { useAppDispatch, useAppSelector } from '@/store';
import { openModal as openModalAction, closeModal as closeModalAction, selectModalIsOpen } from '@/store/slices/modals';

export function useModal() {
  const dispatch = useAppDispatch();
  const modalState = useAppSelector((state) => state.modals);

  const openModal = (modalId: string, props: Record<string, any> = {}) => {
    dispatch(openModalAction({ modalId, props }));
  };

  const closeModal = (modalId: string) => {
    dispatch(closeModalAction(modalId));
  };

  const isOpen = (modalId: string) => {
    return modalState[modalId]?.isOpen ?? false;
  };

  return { openModal, closeModal, isOpen };
}
