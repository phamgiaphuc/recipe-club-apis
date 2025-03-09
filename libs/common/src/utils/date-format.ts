import {
  addDays,
  addHours,
  addMinutes,
  addSeconds,
  addWeeks,
  format,
} from "date-fns";

export const formatDateTime = (timestamp: Date) => {
  return format(timestamp.toISOString(), "dd/MM/yyyy HH:mm:ss");
};

export const generateSessionExpired = (time: string): Date => {
  const timeValue = parseInt(time.slice(0, -1), 10);
  const timeUnit = time.slice(-1);
  switch (timeUnit) {
    case "s": // seconds
      return addSeconds(new Date(), timeValue);
    case "m": // minutes
      return addMinutes(new Date(), timeValue);
    case "h": // hours
      return addHours(new Date(), timeValue * 60);
    case "d": // days
      return addDays(new Date(), timeValue);
    case "w": // weeks
      return addWeeks(new Date(), timeValue * 7);
    default:
      throw new Error(
        "Invalid time format. Use 's', 'm', 'h', 'd' or 'w' (e.g., '30m' or '1h').",
      );
  }
};

export const convertToMilliseconds = (time: string): number => {
  const timeValue = parseInt(time.slice(0, -1), 10);
  const timeUnit = time.slice(-1);
  switch (timeUnit) {
    case "s": // seconds
      return timeValue * 1000;
    case "m": // minutes
      return timeValue * 60 * 1000;
    case "h": // hours
      return timeValue * 60 * 60 * 1000;
    case "d": // days
      return timeValue * 24 * 60 * 60 * 1000;
    case "w": // weeks
      return timeValue * 7 * 24 * 60 * 60 * 1000;
    case "mh": // months
      return timeValue * 30 * 24 * 60 * 60 * 1000;
    case "y": // years
      return timeValue * 365 * 24 * 60 * 60 * 1000;
    default:
      throw new Error(
        "Invalid time format. Use 's', 'm', 'h', 'd' or 'w' (e.g., '30m' or '1h').",
      );
  }
};

export const convertToSeconds = (time: string): number => {
  const timeValue = parseInt(time.slice(0, -1), 10);
  const timeUnit = time.slice(-1);
  switch (timeUnit) {
    case "s": // seconds
      return timeValue;
    case "m": // minutes
      return timeValue * 60;
    case "h": // hours
      return timeValue * 60 * 60;
    case "d": // days
      return timeValue * 24 * 60 * 60;
    case "w": // weeks
      return timeValue * 7 * 24 * 60 * 60;
    default:
      throw new Error(
        "Invalid time format. Use 's', 'm', 'h', 'd' or 'w' (e.g., '30m' or '1h').",
      );
  }
};
