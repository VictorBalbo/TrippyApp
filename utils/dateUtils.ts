import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

export const utcDate = (date: Date) => dayjs(date).utc();
export const isSameDay = (date1?: Date, date2?: Date) =>
  date1 && date2 && utcDate(date1).isSame(utcDate(date2), 'day');
