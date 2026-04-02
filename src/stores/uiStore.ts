import { create } from 'zustand';

interface UIState {
  isMobileMenuOpen: boolean;
  isEnquiryModalOpen: boolean;
  enquiryPrefilledPackage: string | null;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  openEnquiryModal: (packageName?: string) => void;
  closeEnquiryModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isMobileMenuOpen: false,
  isEnquiryModalOpen: false,
  enquiryPrefilledPackage: null,

  toggleMobileMenu: () =>
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),

  closeMobileMenu: () =>
    set({ isMobileMenuOpen: false }),

  openEnquiryModal: (packageName) =>
    set({ isEnquiryModalOpen: true, enquiryPrefilledPackage: packageName ?? null }),

  closeEnquiryModal: () =>
    set({ isEnquiryModalOpen: false, enquiryPrefilledPackage: null }),
}));
