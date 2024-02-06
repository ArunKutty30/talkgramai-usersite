import { create } from "zustand";
import type { User } from "firebase/auth";
import { IBookingSessionDB, ISubscriptionDB, IUserProfileData } from "../constants/types";

type State = {
  user: User | null;
  isFetching: boolean;
  isAllSessionFetching: boolean;
  profileData: IUserProfileData | null;
  subscriptionData: ISubscriptionDB | null;
  overallBookedSession: IBookingSessionDB[];
  isOutdated: boolean;
  userCancelledSession?: number;
  expiredClass: number;
  missedClass: number;
};

type Action = {
  updateFetching: (fetching: boolean) => void;
  updateAllSessionFetching: (fetching: boolean) => void;
  updateUser: (user: User) => void;
  updateProfileData: (data: IUserProfileData) => void;
  updateSubscriptionData: (data: ISubscriptionDB | null) => void;
  refetchUser: () => void;
  setOutdated: () => void;
  updateCancelledSession: (value: number) => void;
  updateExpiredClass: (value: number) => void;
  updateMissedClass: (value: number) => void;
  updateOverallBookedSession: (value: IBookingSessionDB[]) => void;
};

export const userStore = create<State & Action>((set) => ({
  user: null,
  isFetching: true,
  isAllSessionFetching: true,
  profileData: null,
  subscriptionData: null,
  overallBookedSession: [],
  isOutdated: false,
  expiredClass: 0,
  missedClass: 0,
  updateFetching: (fetching) => set(() => ({ isFetching: fetching })),
  updateAllSessionFetching: (fetching) => set(() => ({ isAllSessionFetching: fetching })),
  updateUser: (user) => set(() => ({ user })),
  updateProfileData: (data) => set(() => ({ profileData: data })),
  updateSubscriptionData: (data) => set(() => ({ subscriptionData: data })),
  refetchUser: () => set(() => ({ isOutdated: true })),
  setOutdated: () => set(() => ({ isOutdated: false })),
  updateCancelledSession: (data) => set(() => ({ userCancelledSession: data })),
  updateExpiredClass: (data) => set(() => ({ expiredClass: data })),
  updateMissedClass: (data) => set(() => ({ missedClass: data })),
  updateOverallBookedSession: (data) => set(() => ({ overallBookedSession: data })),
}));
