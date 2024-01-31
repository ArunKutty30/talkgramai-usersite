import {
  EnumTopic,
  IExperience,
  ITransactionStatus,
  TDropdownList,
  TSubscriptionList,
} from "./types";
import { ReactComponent as EmojiGreatIcon } from "../assets/icons/emoji_great.svg";
import { ReactComponent as EmojiAverageIcon } from "../assets/icons/emoji_average.svg";
import { ReactComponent as EmojiNeutralIcon } from "../assets/icons/emoji_neutral.svg";

/* -------DATABASE COLLECTION NAMES--------------- */
export const TUTOR_COLLECTION_NAME = "Tutors";
export const USER_COLLECTION_NAME = "Users";
export const TUTOR_ACCOUNTS_COLLECTION_NAME = "TutorsAccountDetails";
export const TIME_SLOTS_COLLECTION_NAME = "Slots";
export const BOOKINGS_COLLECTION_NAME = "Bookings";
export const SUBSCRIPTION_COLLECTION_NAME = "Subscriptions";
export const DISPUTE_COLLECTION_NAME = "disputes";
/* ----------------------------------------------- */

export const experienceList = [
  { title: IExperience.GREAT, Icon: EmojiGreatIcon },
  { title: IExperience.AVERAGE, Icon: EmojiAverageIcon },
  { title: IExperience.CAN_BE_IMPROVED, Icon: EmojiNeutralIcon },
];

export const bookSessionFilters: TDropdownList[] = [
  {
    name: "Based on Interests",
    value: "Based on Interests",
  },
  {
    name: "Favourite Teacher",
    value: "Favourite Teacher",
  },
  {
    name: "Select Time and Date",
    value: "Select Time and Date",
  },
];

export const meridianList = [
  { name: "am", value: "am" },
  { name: "pm", value: "pm" },
];

export const topicList: TDropdownList[] = [
  {
    name: "Custom Topic",
    value: EnumTopic.CUSTOM_TOPIC,
  },
  {
    name: "Random Topic",
    value: EnumTopic.RANDOM_TOPIC,
  },
];

export const subscriptionList: TSubscriptionList[] = [
  {
    title: "one month",
    offerPrice: 25,
    durationInMonth: 1,
    tag: { status: ITransactionStatus.INFO, text: "Recommended For You" },
    priceForSession: 300,
    recommended: false,
    benefits: [
      "You get a special discount. Making your price per session ₹10",
      "You get a total of 24 sessions per week",
      "30 mins session duration",
    ],
  },
  {
    title: "three months",
    durationInMonth: 3,
    tag: { status: ITransactionStatus.SUCCESSFUL, text: "Most Purchased" },
    priceForSession: 300,
    recommended: true,
    benefits: [
      "You get a special discount. Making your price per session ₹10",
      "You get a total of 24 sessions per week",
      "30 mins session duration",
    ],
  },
  {
    title: "six months",
    offerPrice: 25,
    durationInMonth: 6,
    priceForSession: 300,
    recommended: false,
    benefits: [
      "You get a special discount. Making your price per session ₹10",
      "You get a total of 24 sessions per week",
      "30 mins session duration",
    ],
  },
  {
    title: "twelve months",
    offerPrice: 25,
    durationInMonth: 12,
    priceForSession: 300,
    recommended: false,
    benefits: [
      "You get a special discount. Making your price per session ₹10",
      "You get a total of 24 sessions per week",
      "30 mins session duration",
    ],
  },
];

export const sessionFilters: TDropdownList[] = [
  {
    name: "completed sessions",
    value: "completed sessions",
  },
  {
    name: "missed sessions",
    value: "missed sessions",
  },
  {
    name: "cancelled sessions",
    value: "cancelled sessions",
  },
];

export const vocabularyFeedback = ["need to improve", "good", "better", "great"];

export const grammerFeedback = ["too many errors", "noticeable errors", "few errors", "no errors"];

export const skillsLable = {
  confidence: "confidence",
  passion: "passion",
  listeningComprehension: "listening comprehension",
  conversationBuilding: "conversation Building",
};
