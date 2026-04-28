import { format } from "date-fns";

export function formatDate(date: string) {
  try {
    return format(new Date(date), "yyyy.MM.dd");
  } catch {
    return "未知日期";
  }
}
