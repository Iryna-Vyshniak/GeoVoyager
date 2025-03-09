import { create } from 'zustand';

export interface ModalState {
    isOpenModal: boolean;
    shouldCloseModal: boolean;

    setIsOpenModal: (isOpen: boolean) => void;
    setShouldCloseModal: (shouldClose: boolean) => void;

}

export const useModalStore = create<ModalState>((set) => ({
    isOpenModal: false,
    shouldCloseModal: false,

    setIsOpenModal: (isOpenModal: boolean) => set({ isOpenModal }),
    setShouldCloseModal: (shouldCloseModal: boolean) => set({ shouldCloseModal }),
}));