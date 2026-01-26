const TIMEZONE = "Asia/Tokyo";

const formatDate = (date: Date) => {
  const formatter = new Intl.DateTimeFormat("ja-JP", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = formatter.formatToParts(date);
  const year = parts.find((p) => p.type === "year")?.value;
  const month = parts.find((p) => p.type === "month")?.value;
  const day = parts.find((p) => p.type === "day")?.value;
  return `${year}/${month}/${day}`;
};

const formatTime = (date: Date) => {
  const formatter = new Intl.DateTimeFormat("ja-JP", {
    timeZone: TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return formatter.format(date);
};

export const dateTransform = (date: Date, withTime?: boolean) =>
  `${formatDate(date)}${withTime ? ` ${formatTime(date)}` : ""}`;
