import { create } from 'zustand';

// Zustand store
export const useGlobalStore = create((set) => ({
  selectedProperty: null,
  setSelectedProperty: (property: any) => set({ selectedProperty: property }),

  selectedBooking: null,
  setSelectedBooking: (booking : any) => set({ selectedBooking: booking }),

  userProfile: null,
  setUserProfile: (profile: any) => set({ userProfile: profile }),
}));