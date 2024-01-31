import { startOfDay, addDays, endOfDay } from "date-fns";
import { ITopic, ITutorFeedback } from "./types";

export const generateTimeIntervals = (startHour: number, endHour: number, range: number) => {
  const intervals = [];

  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += range) {
      const startTime = formatTime(hour, minute);
      const endTime = formatTime(hour, minute + range);
      intervals.push(`${startTime} - ${endTime}`);
    }
  }

  return intervals;
};

function formatTime(hour: number, minute: number) {
  const period = hour >= 12 ? "pm" : "am";
  const formattedHour = hour > 12 ? hour - 12 : hour;
  const formattedMinute = minute === 0 ? "00" : minute === 60 ? "00" : minute;
  const formattedHourBasedOnMinute = minute === 60 ? formattedHour + 1 : formattedHour;
  return `${formattedHourBasedOnMinute}.${formattedMinute} ${period}`;
}

export const generateTimeIntervalsWithDate = (
  date: Date,
  startHour: number,
  endHour: number,
  range: number
) => {
  const intervals = [];

  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += range) {
      // Create a new date with the specified date and time
      const startDate = new Date(date);
      startDate.setHours(hour, minute, 0, 0);

      // Create a new date with the specified date and end time
      const endDate = new Date(date);
      endDate.setHours(hour, minute + range, 0, 0);

      intervals.push({
        start: startDate,
        end: endDate,
      });
    }
  }

  return intervals;
};

export const getTomorrow = () => startOfDay(addDays(new Date(), 1));

export const getEndOfTomorrow = () => endOfDay(addDays(new Date(), 1));

export const getStartOfDay = (date: Date) => startOfDay(date);

export const getEndOfDay = (date: Date) => endOfDay(date);

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 0 }).format(
    value
  );

export const getTutorFeedbackObj = (tutorFeedback: ITutorFeedback) => {
  const feedback = { ...tutorFeedback };

  if (!tutorFeedback.grammer["pronounUsage"]) {
    tutorFeedback.grammer["pronounUsage"] = "";
  }

  if (!tutorFeedback.grammer["mostErrors"]) {
    tutorFeedback.grammer["mostErrors"] = "";
  }

  if (!tutorFeedback["skills"]) {
    feedback.skills = {
      confidence: 0,
      conversationBuilding: 0,
      listeningComprehension: 0,
      passion: 0,
    };
  }

  if (!tutorFeedback["suggestions"]) {
    feedback.suggestions = {
      month: 0,
      sessionsPerWeek: 0,
    };
  }
  return feedback;
};

export const getRandomUniqueTopic = (
  topics: ITopic[],
  usedTopics: Set<string>
): ITopic | undefined => {
  // Filter out topics that have not been used
  const availableTopics = topics.filter(
    (topic) => !usedTopics.has(`${topic.category}-${topic.title}`)
  );

  // Check if there are available topics
  if (availableTopics.length === 0) {
    console.log("All topics have been used.");
    return undefined; // No available topics
  }

  // Randomly select a topic from the available ones
  const randomIndex = Math.floor(Math.random() * availableTopics.length);
  const selectedTopic = availableTopics[randomIndex];

  // Mark the selected topic as used
  usedTopics.add(`${selectedTopic.category}-${selectedTopic.title}`);

  return selectedTopic;
};
