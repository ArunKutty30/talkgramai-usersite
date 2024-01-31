import { format } from "date-fns";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// Extend dayjs with plugins
dayjs.extend(utc);
dayjs.extend(timezone);

// Set the timezone to IST (Indian Standard Time)
dayjs.tz.setDefault("Asia/Kolkata");

export const getLocaleDate = (date: Date) => format(date, "do MMMM");

export const getLocaleDateWithYear = (date: Date) => format(date, "do MMM yyyy");

export const customFormat = (date: Date, format: string) => dayjs(date).format(format);

export const slotFormat = (startDate: Date) => dayjs(startDate).tz("Asia/Kolkata").format();

export const formatFromToDate = (fromDate: Date, toDate: Date) => {
  const from = customFormat(fromDate, "hh:mm A");
  const to = customFormat(toDate, "hh:mm A");

  return `${from} - ${to}`;
};
