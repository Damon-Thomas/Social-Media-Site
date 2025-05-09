export default function formatDate(inputDate: string | Date | undefined) {
  if (!inputDate) {
    return "Unknown Date";
  }
  const date = new Date(inputDate);
  const time = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(date);
  const datePart = new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
  return `${time} · ${datePart}`;
}
