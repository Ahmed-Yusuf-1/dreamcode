"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const PREFIX = "dc_draft:";

/**
 * Editor text that survives reloads: saved to localStorage (debounced) under a
 * per-task key, restored on mount, and resettable to the starter code.
 */
export function useDraft(key: string, initial: string) {
  const [value, setValue] = useState(initial);
  const [restored, setRestored] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      try {
        const saved = localStorage.getItem(PREFIX + key);
        if (saved !== null && saved !== initial) {
          setValue(saved);
          setRestored(true);
        } else {
          setValue(initial);
          setRestored(false);
        }
      } catch {
        setValue(initial);
      }
    }, 0);
    return () => clearTimeout(t);
  }, [key, initial]);

  const update = useCallback(
    (next: string) => {
      setValue(next);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        try {
          if (next === initial) localStorage.removeItem(PREFIX + key);
          else localStorage.setItem(PREFIX + key, next);
        } catch {
          /* storage full or unavailable: the draft stays in memory */
        }
      }, 400);
    },
    [key, initial],
  );

  const reset = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    try {
      localStorage.removeItem(PREFIX + key);
    } catch {
      /* ignore */
    }
    setValue(initial);
    setRestored(false);
  }, [key, initial]);

  return { value, setValue: update, reset, restored };
}
