import { useCallback, useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined")
      return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    }
    catch {
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    setStoredValue((prev) => {
      const next = typeof value === "function" ? (value as (val: T) => T)(prev) : value;
      try {
        if (next === null || next === undefined) {
          window.localStorage.removeItem(key);
        }
        else {
          window.localStorage.setItem(key, JSON.stringify(next));
        }
      }
      catch {}
      return next;
    });
  }, [key]);

  return [storedValue, setValue] as const;
}
