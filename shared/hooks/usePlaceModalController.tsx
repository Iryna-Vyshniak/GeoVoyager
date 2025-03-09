'use client';

import { useRouter } from 'next/navigation';
import { useShallow } from 'zustand/react/shallow';

import { ModalState, useModalStore } from '../store/modal-store';
import { usePlaceStore } from '../store/place-store';

export const usePlaceModalController = () => {
  const router = useRouter();
  const { isOpenModal, setIsOpenModal, setShouldCloseModal, shouldCloseModal } = useModalStore(
    useShallow((state: ModalState) => ({
      isOpenModal: state.isOpenModal,
      setIsOpenModal: state.setIsOpenModal,
      setShouldCloseModal: state.setShouldCloseModal,
      shouldCloseModal: state.shouldCloseModal,
    }))
  );
  const { selectedPlace, setSelectedPlace } = usePlaceStore();

  const open = () => {
    setIsOpenModal(true);
    setShouldCloseModal(true);
  };

  const close = () => {
    if (shouldCloseModal) {
      setIsOpenModal(false);
      setSelectedPlace(null);

      setTimeout(() => {
        router.back();
      }, 250);
    } else {
      setSelectedPlace(null);
      router.back();
    }
  };

  return { isOpenModal, open, close, shouldCloseModal, setIsOpenModal, selectedPlace };
};
