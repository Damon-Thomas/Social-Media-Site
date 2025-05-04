/**
 * Formats a date as a relative time string (e.g., "2 minutes", "3 months", "1 year")
 * Returns only the largest applicable time unit.
 *
 * @param date The date to format (Date object or date string)
 * @param includeAgo Whether to append "ago" to the result (default: false)
 * @returns Formatted relative time string
 */
export function formatRelativeTime(
  date: Date | string,
  includeAgo = false
): string {
  const now = new Date();
  const postDate = new Date(date);
  const diffMs = now.getTime() - postDate.getTime();

  // Convert to seconds
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) {
    const text = `${diffSec} second${diffSec !== 1 ? "s" : ""}`;
    return includeAgo ? `${text} ago` : text;
  }

  // Convert to minutes
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) {
    const text = `${diffMin} minute${diffMin !== 1 ? "s" : ""}`;
    return includeAgo ? `${text} ago` : text;
  }

  // Convert to hours
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) {
    const text = `${diffHours} hour${diffHours !== 1 ? "s" : ""}`;
    return includeAgo ? `${text} ago` : text;
  }

  // Convert to days
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) {
    const text = `${diffDays} day${diffDays !== 1 ? "s" : ""}`;
    return includeAgo ? `${text} ago` : text;
  }

  // Convert to months
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) {
    const text = `${diffMonths} month${diffMonths !== 1 ? "s" : ""}`;
    return includeAgo ? `${text} ago` : text;
  }

  // Convert to years
  const diffYears = Math.floor(diffMonths / 12);
  const text = `${diffYears} year${diffYears !== 1 ? "s" : ""}`;
  return includeAgo ? `${text} ago` : text;
}
