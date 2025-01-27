import { create } from 'zustand';

type State = {
  isSignup: boolean;
  showHeader: boolean;
  openVerifyPhoneNoModal: boolean;
};

type Action = {
  setIsSignup: (isSignup: boolean) => void;
  setShowHeader: (value: boolean) => void;
  setOpenVerifyPhoneNoModal: (openVerifyPhoneNoModal: boolean) => void;
};

export const generalStore = create<State & Action>((set) => ({
  isSignup: false,
  setIsSignup: (isSignup) => set(() => ({ isSignup: isSignup })),
  showHeader: true,
  setShowHeader: (value) => set(() => ({ showHeader: value })),
  openVerifyPhoneNoModal: false,
  setOpenVerifyPhoneNoModal: (openVerifyPhoneNoModal) => set(() => ({ openVerifyPhoneNoModal })),
}));
