import testimonial1 from "../assets/images/testimonial1.png";
import testimonial2 from "../assets/images/testimonial2.png";
import testimonial3 from "../assets/images/testimonial1.png";
import testimonial4 from "../assets/images/testimonial1.png";
import { IFluencyFeedback, IPronunciationFeedback } from "../constants/types";

export const designations = [
  "Student",
  "Job Seeker",
  "Working Professional",
  "Businessman/woman",
  "Other",
];

export const issues = [
  "Unable to get the right words at the right moment",
  "Panicking to speak in English",
  "Fear of being mocked/judged by people",
  "Stammering while speaking English while I don’t stammer in my native language",
  "Feeling inferior/Self-doubt after talking in English",
];

export const goals = [
  "Career Growth",
  "To boost Self-Confidence",
  "To connect with other language speakers/English speakers",
];

export const interests = [
  "Leisure and Lifestyle",
  "Travel and Exploration",
  "Health and Well-being",
  "Personal Growth and Development",
  "Entertainment",
  "Technology and Science",
  "Literature and Arts",
  "Culinary and Beverage",
  "Society and Culture",
  "Relationships and Interpersonal",
  "Spirituality and Beliefs",
  "Nature and Environment",
  "Business and Finance",
  "History and Knowledge",
  "Transport and Vehicles",
];

export const testimonials = [
  {
    author: "Ananthan",
    description:
      "I've tried numerous language apps, but the English fluency improvement app with online classes and tutors truly stands out! The interactive classes helped me build my speaking confidence, and the tutors were patient and skilled. My fluency has improved remarkably, and I'm now able to communicate more effectively",
  },
  {
    author: "Kiran",
    description:
      "As a non-native English speaker, I was hesitant to join online classes. However, this app's English fluency program changed my perspective completely. The personalized attention from the tutors in the online classes made a huge difference. I'm now able to express myself in English more naturally and fluently.",
  },
  {
    author: "Sowmya Mishra",
    description:
      " I struggled with English fluency for years, but this app made the journey enjoyable. The tutors were knowledgeable and supportive, and my language skills have improved beyond my expectations.",
  },
  {
    author: "Prabakar",
    description:
      "Talkgram helped me refine my grammar, expand my vocabulary, and speak confidently in various real-life situations. If you're serious about enhancing your English, this app is a must-try.",
  },
];

export const authSliderImages = [testimonial1, testimonial2, testimonial3, testimonial4];

export const skillsLable = {
  confidence: "confidence",
  passion: "passion",
  listeningComprehension: "listening comprehension",
  conversationBuilding: "conversation Building",
};

export const fluencyFeedbackItems = [
  IFluencyFeedback.LONG_PAUSES,
  IFluencyFeedback.INCOMPLETE_SENTENCES,
  IFluencyFeedback.FILLER_SOUNDS,
];

export const pronunciationFeedbackItems = [
  {
    name: IPronunciationFeedback.SH_SOUND,
    info: '"Sh" sound: Example: "she" pronounced as "see", "shoes" pronounced as "soos.", etc.,',
  },
  {
    name: IPronunciationFeedback.H_SOUND,
    info: "\"H\" sound: Example: Pronunciation of words like honest, hour, etc., without silencing 'h'. The correct pronunciation is 'onest', 'our'.,",
  },
  {
    name: IPronunciationFeedback.DANDTH_SOUND,
    info: '"D" and "TH" sounds: Example: "The" pronounced as "de" or "that" pronounced as "dat."',
  },
  {
    name: IPronunciationFeedback.FANDP_SOUND,
    info: '"F" and "P" sounds: Example: "Fish" pronounced as "pish" or "phone" pronounced as "pone"',
  },
];

export const vocabulary = {
  vocabularyRange: {
    name: "Vocabulary Range",
    info: "The diversity and quantity of words a person knows and can use effectively",
    options: ["limited", "moderate", "extensive"],
  },
  wordChoicePrecision: {
    name: "Word Choice Precision",
    info: "The ability to select exact and specific words to convey ideas clearly and accurately",
    options: ["appropriate", "occasionally inappropriate", "inappropriate"],
  },
};

export const grammerTitles = [
  { name: "Tenses", value: "tenses" },
  { name: "Articles & Prepositions", value: "articlesAndPrepositions" },
  { name: "Subject Verb Agreement", value: "subjectVerb" },
  { name: "Pronoun usage", value: "pronounUsage" },
];
