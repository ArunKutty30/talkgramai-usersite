import { create } from 'zustand';
import type { User } from 'firebase/auth';
import {
  IBookingSessionDB,
  ISubscriptionDB,
  IUserProfileData,
  EUserType,
  TLoadingStatus,
} from '../constants/types';
import { getUserSusbcribedToDemo } from '../services/subscriptionService';

type State = {
  user: User | null;
  isFetching: boolean;
  subscriptionDataFetching: TLoadingStatus;
  isAllSessionFetching: boolean;
  profileData: IUserProfileData | null;
  subscriptionData: ISubscriptionDB | null;
  overallBookedSession: IBookingSessionDB[];
  currentPlanSessions: IBookingSessionDB[];
  isOutdated: boolean;
  userCancelledSession?: number;
  expiredClass: number;
  missedClass: number;
  sessionLeft: number;
  isSubscriptionDataOutdated: boolean;
  userType: EUserType;
};

type Action = {
  updateFetching: (fetching: boolean) => void;
  updateAllSessionFetching: (fetching: boolean) => void;
  updateSubscriptionDataFetching: (subscriptionDataFetching: TLoadingStatus) => void;
  updateUser: (user: User) => void;
  updateProfileData: (data: IUserProfileData) => void;
  updateSubscriptionData: (data: ISubscriptionDB | null) => void;
  refetchUser: () => void;
  setOutdated: () => void;
  updateCancelledSession: (value: number) => void;
  updateExpiredClass: (value: number) => void;
  updateMissedClass: (value: number) => void;
  updateCurrentPlanSession: (value: IBookingSessionDB[]) => void;
  updateOverallBookedSession: (value: IBookingSessionDB[]) => void;
  updateSessionLeft: (sessionLeft: number) => void;
  updateSubscriptionDataOutdated: (value: boolean) => void;
  setHasDemoClassBooked: (userUid: string) => void;
};

export const userStore = create<State & Action>((set) => ({
  user: null,
  isFetching: true,
  subscriptionDataFetching: 'PENDING',
  isAllSessionFetching: true,
  profileData: null,
  subscriptionData: null,
  overallBookedSession: [],
  isOutdated: false,
  expiredClass: 0,
  missedClass: 0,
  sessionLeft: 0,
  currentPlanSessions: [],
  isSubscriptionDataOutdated: false,
  userType: EUserType.NEW_USER,
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
  updateCurrentPlanSession: (data) => set(() => ({ currentPlanSessions: data })),
  updateSessionLeft: (sessionLeft) => set(() => ({ sessionLeft })),
  updateSubscriptionDataFetching: (subscriptionDataFetching) =>
    set(() => ({ subscriptionDataFetching })),
  updateSubscriptionDataOutdated: (value) => set(() => ({ isSubscriptionDataOutdated: value })),
  setHasDemoClassBooked: async (userUid) => {
    try {
      const result = await getUserSusbcribedToDemo(userUid);
      set(() => ({ userType: result }));
    } catch (error) {
      console.log(error);
    }
  },
}));
