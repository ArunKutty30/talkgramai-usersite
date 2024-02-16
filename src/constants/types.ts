import { Timestamp } from 'firebase/firestore';

export enum ICategory {
  TUTOR_TALK = 'TUTOR_TALK',
  CURRICULUM = 'CURRICULUM',
}

export enum IExperience {
  GREAT = 'GREAT',
  AVERAGE = 'AVERAGE',
  CAN_BE_IMPROVED = 'CAN BE IMPROVED',
}

export enum ISession {
  UPCOMING = 'upcoming',
  PREVIOUS = 'previous',
  MISSED = 'missed',
  CANCELLED = 'cancelled',
}

export enum ITransactionStatus {
  SUCCESSFUL = 'successful',
  PENDING = 'pending',
  INFO = 'info',
  FAILED = 'failed',
}

export enum IStatus {
  SUCCESS = 'success',
  LOADING = 'loading',
  ERROR = 'error',
}

export enum EBookingStatus {
  UPCOMING = 'UPCOMING',
  TUTOR_MISSED = 'TUTOR_MISSED',
  TUTOR_CANCELLED = 'TUTOR_CANCELLED',
  USER_CANCELLED = 'USER_CANCELLED',
  MISSED = 'MISSED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export enum IFluencyFeedback {
  LONG_PAUSES = 'long pauses',
  INCOMPLETE_SENTENCES = 'incomplete sentences',
  FILLER_SOUNDS = 'filler sounds',
}

export enum IPronunciationFeedback {
  SH_SOUND = 'Sh sound',
  H_SOUND = 'H sound',
  DANDTH_SOUND = 'D and TH sounds',
  FANDP_SOUND = 'F and P sounds',
}

export interface IUserProfileData {
  designation: string;
  gender: string;
  goals: string[];
  interests: string[];
  issues: string[];
  email: string;
  displayName: string;
  isNewUser: boolean;
  demoClassBooked: boolean;
  currentSubscriptionId?: string;
  favouriteTutors?: string[];
  profileImg: string;
  completedSession: number | undefined;
}

export interface ITutorProfileData {
  specialization: string[];
  gender: string;
  interests: string[];
  aadharNo: string;
  bankAccountNo: string;
  ifscCode: string;
  email: string;
  username: string;
  profileImg: string;
  description: string;
  id: string;
}

export type TDropdownList = {
  name: string;
  value: string;
};

export type TSubscriptionList = {
  title: string;
  offerPrice?: number;
  priceForSession: number;
  durationInMonth: number;
  tag?: {
    status: ITransactionStatus;
    text: string;
  };
  recommended: boolean;
  benefits: string[];
};

export interface ISelectedPlan {
  title: string;
  offerPrice?: number;
  durationInMonth: number;
  total: number;
  noOfSessions: number;
  sessionPerWeek: number;
}

export interface ITutorSlot {
  id: string;
  startTime: Date;
  endTime: Date;
  tutors: { tutorId: string; isReserved: boolean }[];
}

export interface ITutorSlotDB {
  id: string;
  startTime: Timestamp;
  endTime: Timestamp;
  tutors: { tutorId: string; isReserved: boolean }[];
}

export interface IBookingSession {
  id: string;
  startTime: Date;
  endTime: Date;
  slotId: string;
  topic: string;
  topicInfo?: {
    title: string;
    category: string;
  };
  description: string;
  user: string;
  tutor: string;
  createdAt: Date;
  updatedAt: Date;
  userFeedback?: {
    experience: string;
    feedback: string;
    rating: number;
  };
  meetingId?: string;
  currentSession?: number;
  status:
    | 'COMPLETED'
    | 'UPCOMING'
    | 'USER_CANCELLED'
    | 'TUTOR_CANCELLED'
    | 'TUTOR_MISSED'
    | 'MISSED';
  feedbackFromTutor?: INewTutorFeedback;
  chats?: IChat[];
}

export interface ISubscription {
  id: string;
  startDate: Timestamp;
  endData: Timestamp;
  noOfSession: number;
  completedSession?: number;
  missedSession?: number;
}

export interface IBookingSessionDB {
  id: string;
  startTime: Timestamp;
  endTime: Timestamp;
  slotId: string;
  topic: string;
  description: string;
  user: string;
  tutor: string;
  subscriptionId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  currentSession?: number;
  feedbackFromTutor?: INewTutorFeedback;
  chats?: IChat[];
  status:
    | 'COMPLETED'
    | 'UPCOMING'
    | 'USER_CANCELLED'
    | 'TUTOR_CANCELLED'
    | 'TUTOR_MISSED'
    | 'MISSED';
}

export interface IDispute {
  id: string;
  dateOfIssue: Timestamp;
  description: string;
  issue: string;
  sessionId: string;
  solution: string;
  status: 'pending' | 'resolved';
  userId: string;
}

export interface IPlan extends TSubscriptionList {
  total: number;
  noOfSessions: number;
  sessionPerWeek: number;
}

export type TCard = {
  id: string;
  token_iin: null;
  name: string;
  network: string;
  emi: boolean;
  last4: string;
  entity: string;
  sub_type: string;
  issuer: null;
  type: string;
  international: boolean;
};

export interface ISubscriptionDB {
  id: string;
  endDate: Timestamp;
  createdAt: Timestamp;
  demoClass?: boolean;
  plan: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  startDate: Timestamp;
  noOfSession: number;
  totalPrice: number;
  updateAt: Timestamp;
  user: string;
  completedSession?: number;
  cancelledSession?: number;
  backlogSession?: number;
  bookedSession?: number;
  offer: number;
  sessionPerWeek?: number;
  allSessionsCompleted?: boolean;
  recording?: boolean;
  transactionDetails?: {
    captured: boolean;
    contact: string;
    created_at: number;
    acquirer_data: {
      auth_code: string;
    };
    id: string;
    card: TCard | null;
    amount: number;
    wallet: null;
    email: string;
    error_reason: null;
    method: string;
    amount_refunded: number;
    error_source: null;
    notes: {
      address: string;
    };
    entity: string;
    international: boolean;
    status: string;
    description: string;
    refund_status: null;
    currency: string;
    fee: number;
    bank: null;
    invoice_id: null;
    vpa: null;
    error_code: null;
    card_id: string;
    error_description: null;
    error_step: null;
    base_amount: number;
    order_id: string;
    tax: number;
  };
}

export interface ITransactionDB {
  id: string;
  endDate: Timestamp;
  createdAt: Timestamp;
  demoClass?: boolean;
  plan: string;
  sessionPerWeek: number;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  startDate: Timestamp;
  noOfSession: number;
  totalPrice: number;
  updateAt: Timestamp;
  user: string;
  completedSession?: number;
  missedSession?: number;
  cancelledSession?: number;
  backlogSession?: number;
  bookedSession?: number;
  offer: number;
  transactionDetails?: {
    captured: boolean;
    contact: string;
    created_at: number;
    acquirer_data: {
      auth_code: string;
    };
    id: string;
    card: TCard | null;
    amount: number;
    wallet: null;
    email: string;
    error_reason: null;
    method: string;
    amount_refunded: number;
    error_source: null;
    notes: {
      address: string;
    };
    entity: string;
    international: boolean;
    status: string;
    description: string;
    refund_status: null;
    currency: string;
    fee: number;
    bank: null;
    invoice_id: null;
    vpa: null;
    error_code: null;
    card_id: string;
    error_description: null;
    error_step: null;
    base_amount: number;
    order_id: string;
    tax: number;
  };
}

export interface IRecordings {
  pageInfo: {
    currentPage: number;
    perPage: number;
    lastPage: number;
    total: number;
  };
  data: {
    apiKey: string;
    sessionId: string;
    template: {
      url: string;
      config: {
        layout: {
          type: string;
          priority: string;
          gridSize: string;
        };
        theme: string;
      };
      isCustom: boolean;
      mode: string;
      quality: string;
      region: string;
      orientation: string;
      createdAt: string;
      updatedAt: string;
    };
    fileId: string;
    webhook: {
      totalCount: number;
      successCount: number;
      data: never[];
    };
    roomId: string;
    links: {
      get_room: string;
      get_session: string;
    };
    file: {
      meta: {
        resolution: {
          width: number;
          height: number;
        };
        format: string;
        duration: number;
      };
      filePath: string;
      type: string;
      size: number;
      ratio: {
        '720': number;
      };
      userStorage: null;
      createdAt: string;
      updatedAt: string;
      fileUrl: string;
      id: string;
    };
    id: string;
  }[];
}

export interface ITutorFeedback {
  status: string;
  fluencyRating: number;
  pronounciationRating: number;
  vocabulary?: string;
  grammer: {
    tenses: string;
    articlesAndPrepositions: string;
    subjectVerb: string;
    pronounUsage?: string;
    other: string;
    mostErrors: string;
  };
  skills: {
    confidence: number;
    passion: number;
    listeningComprehension: number;
    conversationBuilding: number;
  };
  suggestions?: {
    month: number;
    sessionsPerWeek: number;
  };
}

export interface ILessonPlanDB {
  id: string;
  category: string;
  title: string[];
}

export interface ITopic {
  title: string;
  category: string;
  pointers: {
    pointer: string;
    questions: string[];
  }[];
  vocabulary: {
    word: string;
    speech: string;
    meaning: string;
  }[][];
}

export enum EnumTopic {
  CUSTOM_TOPIC = 'Custom Topic',
  RANDOM_TOPIC = 'Random Topic',
}

export type TGrammar =
  | 'too many errors'
  | 'noticeable errors'
  | 'few errors'
  | 'Rarely noticeable'
  | 'no errors';

export interface INewTutorFeedback {
  status: string;
  fluency: {
    rating: number;
    feedback: string;
  };
  pronunciation: {
    rating: number;
    feedback: string;
  };
  vocabulary: {
    general: string;
    range: 'limited' | 'moderate' | 'extensive';
    wordChoicePrecision: 'appropriate' | 'occasionally inappropriate' | 'inappropriate';
  };
  grammar: {
    tenses: TGrammar;
    mostErrors: string;
    articlesAndPrepositions: TGrammar;
    subjectVerb: TGrammar;
    pronounUsage: TGrammar;
    other: string;
  };
  skills: {
    confidence: number;
    passion: number;
    listeningComprehension: number;
    conversationBuilding: number;
  };
  suggestions: {
    month: number;
    sessionsPerWeek: number;
  };
  generalFeedback: string;
}

export interface IChat {
  peerId: string;
  peerName: string;
  message: string;
  payload: string;
  timestamp: string;
  topic: string;
}

export interface ITutorBlockedUserDoc {
  id: string;
  blockedUsers: string[];
}
