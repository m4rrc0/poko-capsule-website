import dayjs from "dayjs";

/** Converts the given date string to ISO8610 format. */
export const toISOString = (dateString) => dayjs(dateString).toISOString();

/** Formats a date using dayjs's conventions: https://day.js.org/docs/en/display/format */
export const formatDate = (date, format) => dayjs(date).format(format);

/** Converts a date to a slug using dayjs's conventions: https://day.js.org/docs/en/display/format */
export const dateToSlug = (dateString) =>
  dayjs(dateString).format("YYYY-MM-DD");
