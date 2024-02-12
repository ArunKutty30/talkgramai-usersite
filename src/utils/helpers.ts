import dayjs from "dayjs";

function separateIntoWeeks(startDate: Date, endDate: Date): number {
  // Calculate the difference in milliseconds between start and end date
  const timeDiff = endDate.getTime() - startDate.getTime();

  // Calculate the number of milliseconds in a week
  const oneWeek = 7 * 24 * 60 * 60 * 1000;

  // Calculate the number of weeks between the two dates
  const weeks = Math.ceil(timeDiff / oneWeek);

  return weeks;
}

export function getCurrentWeekInfo(
  startDate: Date,
  endDate: Date,
  currentDate = new Date()
): {
  totalWeeks: number;
  currentWeek: number;
  currentWeekStartDate: Date;
  currentWeekEndDate: Date;
  lastWeekStartDate: Date;
  lastWeekEndDate: Date;
} {
  console.log(startDate);
  console.log(endDate);
  const weeks = separateIntoWeeks(startDate, endDate);

  // Calculate the number of milliseconds from the start date to the current date
  const timeDiff = currentDate.getTime() - startDate.getTime();

  // Calculate the current week
  const currentWeek = Math.ceil(timeDiff / (7 * 24 * 60 * 60 * 1000));

  // Calculate the start date of the current week
  const currentWeekStartDate = new Date(startDate);
  currentWeekStartDate.setUTCDate(startDate.getUTCDate() + (currentWeek - 1) * 7);

  // Calculate the end date of the current week
  const currentWeekEndDate = dayjs(new Date(currentWeekStartDate)).add(7, "days").toDate();

  // Calculate the start date of the last week
  const lastWeekStartDate = new Date(currentWeekStartDate);
  lastWeekStartDate.setUTCDate(lastWeekStartDate.getUTCDate() - 7);

  // Calculate the end date of the last week
  const lastWeekEndDate = dayjs(new Date(lastWeekStartDate)).add(7, "days").toDate();

  return {
    totalWeeks: weeks,
    currentWeek,
    currentWeekStartDate: currentWeekStartDate,
    currentWeekEndDate: currentWeekEndDate,
    lastWeekStartDate,
    lastWeekEndDate: lastWeekEndDate,
  };
}

// Example usage
// const startDate = new Date("2023-01-01"); // Start date
// const endDate = new Date("2023-12-31"); // End date

// const { currentWeek, currentWeekStartDate, currentWeekEndDate } = getCurrentWeekInfo(
//   startDate,
//   endDate
// );

// console.log(`The current week is: Week ${currentWeek}`);
// console.log(`Start date of the current week: ${currentWeekStartDate.toISOString().split("T")[0]}`);
// console.log(`End date of the current week: ${currentWeekEndDate.toISOString().split("T")[0]}`);

export const addPrefixZero = (value: number) => {
  return value < 10 ? `0${value}` : value;
};
