import {
  EnumTopic,
  IExperience,
  ITransactionStatus,
  TDropdownList,
  TSubscriptionList,
} from './types';
import { ReactComponent as EmojiGreatIcon } from '../assets/icons/emoji_great.svg';
import { ReactComponent as EmojiAverageIcon } from '../assets/icons/emoji_average.svg';
import { ReactComponent as EmojiNeutralIcon } from '../assets/icons/emoji_neutral.svg';

/* -------DATABASE COLLECTION NAMES--------------- */
export const TUTOR_COLLECTION_NAME = 'Tutors';
export const USER_COLLECTION_NAME = 'Users';
export const TUTOR_ACCOUNTS_COLLECTION_NAME = 'TutorsAccountDetails';
export const TIME_SLOTS_COLLECTION_NAME = 'Slots';
export const BOOKINGS_COLLECTION_NAME = 'Bookings';
export const SUBSCRIPTION_COLLECTION_NAME = 'Subscriptions';
export const DISPUTE_COLLECTION_NAME = 'disputes';
export const BLOCK_USER_COLLECTION_NAME = 'BlockUsers';
/* ----------------------------------------------- */

export const experienceList = [
  { title: IExperience.GREAT, Icon: EmojiGreatIcon },
  { title: IExperience.AVERAGE, Icon: EmojiAverageIcon },
  { title: IExperience.CAN_BE_IMPROVED, Icon: EmojiNeutralIcon },
];

export const bookSessionFilters: TDropdownList[] = [
  {
    name: 'Based on Interests',
    value: 'Based on Interests',
  },
  {
    name: 'Favourite Teacher',
    value: 'Favourite Teacher',
  },
  // {
  //   name: "Select Time and Date",
  //   value: "Select Time and Date",
  // },
];

export const meridianList = [
  { name: 'am', value: 'am' },
  { name: 'pm', value: 'pm' },
];

export const topicList: TDropdownList[] = [
  {
    name: 'Custom Topic',
    value: EnumTopic.CUSTOM_TOPIC,
  },
  {
    name: 'Random Topic',
    value: EnumTopic.RANDOM_TOPIC,
  },
];

export const subscriptionList: TSubscriptionList[] = [
  {
    title: 'one month',
    offerPrice: 25,
    durationInMonth: 1,
    tag: { status: ITransactionStatus.INFO, text: 'Recommended For You' },
    priceForSession: 300,
    // priceForSession: 220,
    recommended: false,
    benefits: [
      'You get a special discount. Making your price per session ₹10',
      'You get a total of 24 sessions per week',
      '30 mins session duration',
    ],
  },
  // {
  //   title: 'Two months',
  //   durationInMonth: 2,
  //   tag: { status: ITransactionStatus.SUCCESSFUL, text: 'Most Purchased' },
  //   priceForSession: 300,
  //   // priceForSession: 200,
  //   recommended: false,
  //   benefits: [
  //     'You get a special discount. Making your price per session ₹10',
  //     'You get a total of 24 sessions per week',
  //     '30 mins session duration',
  //   ],
  // },
  {
    title: 'three months',
    durationInMonth: 3,
    tag: { status: ITransactionStatus.SUCCESSFUL, text: 'Most Purchased' },
    priceForSession: 300,
    // priceForSession: 160,
    recommended: true,
    benefits: [
      'You get a special discount. Making your price per session ₹10',
      'You get a total of 24 sessions per week',
      '30 mins session duration',
    ],
  },
  {
    title: 'six months',
    offerPrice: 25,
    durationInMonth: 6,
    priceForSession: 300,
    // priceForSession: 150,
    recommended: false,
    benefits: [
      'You get a special discount. Making your price per session ₹10',
      'You get a total of 24 sessions per week',
      '30 mins session duration',
    ],
  },
  {
    title: 'twelve months',
    offerPrice: 25,
    durationInMonth: 12,
    priceForSession: 300,
    // priceForSession: 145,
    recommended: false,
    benefits: [
      'You get a special discount. Making your price per session ₹10',
      'You get a total of 24 sessions per week',
      '30 mins session duration',
    ],
  },
];

export const sessionFilters: TDropdownList[] = [
  {
    name: 'completed sessions',
    value: 'completed sessions',
  },
  {
    name: 'missed sessions',
    value: 'missed sessions',
  },
  {
    name: 'cancelled sessions',
    value: 'cancelled sessions',
  },
];

export const vocabularyFeedback = ['need to improve', 'good', 'better', 'great'];

export const grammerFeedback = ['too many errors', 'noticeable errors', 'few errors', 'no errors'];

export const skillsLable = {
  confidence: 'confidence',
  passion: 'passion',
  listeningComprehension: 'listening comprehension',
  conversationBuilding: 'conversation Building',
};

export const faqs = [
  {
    question: 'What is a backlog session?',
    answer:
      "A backlog session is an additional session provided when a scheduled session couldn't be conducted due to technical glitches or errors on our part. It's arranged to compensate for any missed sessions beyond the user's control.",
  },
  {
    question: 'How can I cancel a booked session?',
    answer:
      "You can cancel booked sessions up to 3 hours before the scheduled start time. However, there's a limit of up to 2 cancellations per subscription month. Subscription month refers to the period from your initial subscription date to the date that comes after 30 days from the initial subscription date. ",
  },
  {
    question: 'What is an expired session?',
    answer:
      "An expired session occurs when the allocated sessions for a week haven't been booked within the specified timeframe. For example, if you subscribe to 3 sessions per week starting on a Tuesday, all 3 sessions should be utilized by the following Tuesday",
  },
  {
    question: "What happens if there's a technical/signal error from the tutor's side?",
    answer:
      'In such cases, users can report the issue by raising a dispute and providing relevant evidence, such as screenshots. Upon verification, a backlog session will be added to compensate for the missed session.',
  },
  {
    question: 'What if the tutor misses my booked session?',
    answer:
      'If the tutor misses your booked session, a backlog session will be added to your current subscription.You can make use of the backlog sessions before your subscription ends',
  },
  {
    question: 'What will happen if I miss a booked session?',
    answer:
      "If you miss a session, it will be considered a missed session with no backlog provided. It's strongly advised to attend sessions at the scheduled times to avoid missing out. ",
  },
];
