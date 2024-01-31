import { create } from "zustand";

type State = {
  selectedFilter: string;
  searchText: string;
};

type Action = {
  setSelectedFilter: (fetching: string) => void;
  setSearchText: (text: string) => void;
};

export const useBookingFilterStore = create<State & Action>((set) => ({
  selectedFilter: "",
  searchText: "",
  setSelectedFilter: (filter) => set(() => ({ selectedFilter: filter })),
  setSearchText: (text) => set(() => ({ searchText: text })),
}));
