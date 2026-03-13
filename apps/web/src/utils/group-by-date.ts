import { format, isToday, isYesterday } from "date-fns";

export function groupByDate<T>(items: T[], getDate: (item: T) => Date): [string, T[]][] {
  const map = new Map<string, T[]>();
  for (const item of items) {
    const d = getDate(item);
    const key = isToday(d) ? "Today" : isYesterday(d) ? "Yesterday" : format(d, "MMMM d, yyyy");
    if (!map.has(key))
      map.set(key, []);
    map.get(key)!.push(item);
  }
  return [...map.entries()];
}
