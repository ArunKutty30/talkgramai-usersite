import { create } from "zustand";
import { ICategory } from "../constants/types";

type State = {
  category: ICategory;
  time: string;
  date: Date;
  selectedTutor: string | null;
  currentSession: any;
  updateCurrentSession: (session: any) => void;
};

type Action = {
  updateTime: (time: string) => void;
  updateDate: (date: Date) => void;
  updateSelectedTutor: (selectedTutor: string) => void;
  // updateCurrentSession: (currentSession: any) => void
};

export const useBookSessionStore = create<State & Action>((set) => ({
  category: ICategory.TUTOR_TALK,
  time: "",
  date: new Date(),
  selectedTutor: null,
  updateTime: (time) => set(() => ({ time })),
  updateDate: (date) => set(() => ({ date })),
  updateSelectedTutor: (selectedTutor) => set(() => ({ selectedTutor })),
  currentSession: {},
  updateCurrentSession: (session) => set({ currentSession: session }),
}));
