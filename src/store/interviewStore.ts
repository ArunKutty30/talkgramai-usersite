import { create } from 'zustand';
import { IInterviewCollection } from '../constants/types';

type State = {
  step: number;
  currentQuestion: number;
  questions: string[];
  collections: IInterviewCollection[];
};

type Action = {
  setStep: (step: number) => void;
  setCurrentQuestion: (currentQuestion: number) => void;
  setQuestion: (questions: string[]) => void;
  setCollections: (collections: IInterviewCollection[]) => void;
  reset: () => void;
};

export const useInterviewStore = create<State & Action>((set) => ({
  step: 1,
  setStep: (step) => set(() => ({ step })),
  currentQuestion: 1,
  setCurrentQuestion: (currentQuestion) => set(() => ({ currentQuestion })),
  questions: [],
  setQuestion: (questions) => set(() => ({ questions })),
  collections: [],
  setCollections: (collections) => set(() => ({ collections })),
  reset: () => set(() => ({ step: 1, currentQuestion: 1, questions: [], collections: [] })),
}));
