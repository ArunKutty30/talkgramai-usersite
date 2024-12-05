import { create } from 'zustand';
import { CallStatus } from '../hooks/useCall';

type State = {
  activeCall: CallStatus | null;
};

type Action = {
  setActiveCall: (activeCall: CallStatus | null) => void;
};

export const callsStore = create<State & Action>((set) => ({
  activeCall: null,
  setActiveCall: (activeCall) => set({ activeCall }),
}));
