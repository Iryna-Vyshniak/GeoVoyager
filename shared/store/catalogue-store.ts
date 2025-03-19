import { create } from 'zustand';

import { TOURIST_DATA } from '../mock/tourist-spot-data';
import { Place } from '../shared.types';

interface CatalogStore {
  currentPage: number;
  catalogPages: Place[];
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
}

export const useCatalogStore = create<CatalogStore>((set, get) => ({
  currentPage: 0,
  catalogPages: TOURIST_DATA,
  nextPage: () => {
    const { currentPage, catalogPages } = get();
    if (currentPage < catalogPages.length) {  // Changed from length - 1 since we'll use spreads
      set({ currentPage: currentPage + 1 });
    }
  },
  prevPage: () => {
    const { currentPage } = get();
    if (currentPage > 0) {
      set({ currentPage: currentPage - 1 });
    }
  },
  goToPage: (page) => {
    const { catalogPages } = get();
    if (page >= 0 && page <= catalogPages.length) {
      set({ currentPage: page });
    }
  },
}));