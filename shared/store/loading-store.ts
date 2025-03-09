import { create } from 'zustand';

interface LoadingState {
    isLoading: boolean;
    progress: number;
    setIsLoading: (isLoading: boolean) => void;
    setProgress: (progress: number) => void;
}

export const useLoadingStore = create<LoadingState>((set) => ({
    isLoading: true,
    progress: 0,
    setIsLoading: (isLoading: boolean) => set({ isLoading }),
    setProgress: (progress: number) => set({ progress }),
}));