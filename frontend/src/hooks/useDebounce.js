import { useState, useEffect } from "react";

/**
 * Custom hook to debounce a value.
 * @param value - The value to debounce.
 * @param delay - The delay in milliseconds.
 * @returns The debounced value.
 */
export default function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
