import { create } from 'zustand';
import { Place } from '../shared.types';

export interface PlaceState {
  selectedPlace: Place | null;
  setSelectedPlace: (place: Place | null) => void;
}

export const usePlaceStore = create<PlaceState>((set) => ({
  selectedPlace: null,
  setSelectedPlace: (place: Place | null) => set({ selectedPlace: place }),
}));
