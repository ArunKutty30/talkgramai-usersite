import { create } from "zustand";

type State = {
  fetching: boolean;
  session: number;
  endDate: Date;
};

type Action = {
  setReminder: (value: State) => void;
};

export const reminderStore = create<State & Action>((set) => ({
  fetching: true,
  session: 0,
  endDate: new Date(),
  setReminder: (value) => set(() => ({ ...value })),
}));
