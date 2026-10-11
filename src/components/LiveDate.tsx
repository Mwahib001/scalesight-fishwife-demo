"use client";

import { createContext, useContext, useSyncExternalStore } from "react";

const CurrentDate = createContext<string | null>(null);

function snapshot() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function subscribe(onChange: () => void) {
  let timer: ReturnType<typeof setTimeout>;
  const tick = () => {
    onChange();
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    // Recheck the clock periodically as well as at local midnight.
    timer = setTimeout(
      tick,
      Math.min(60_000, midnight.getTime() - now.getTime()),
    );
  };
  const onResume = () => onChange();
  tick();
  window.addEventListener("focus", onResume);
  document.addEventListener("visibilitychange", onResume);
  return () => {
    clearTimeout(timer);
    window.removeEventListener("focus", onResume);
    document.removeEventListener("visibilitychange", onResume);
  };
}

export function LiveDateProvider({ children }: { children: React.ReactNode }) {
  // A neutral server snapshot avoids stale build dates and hydration mismatches.
  const today = useSyncExternalStore(subscribe, snapshot, () => null);
  return <CurrentDate.Provider value={today}>{children}</CurrentDate.Provider>;
}

export function LiveDate({
  value = "today",
  weekday = false,
  year = true,
  uppercase = false,
}: {
  value?: "today" | "weekStart" | "nextReview";
  weekday?: boolean;
  year?: boolean;
  uppercase?: boolean;
}) {
  const today = useContext(CurrentDate);
  if (!today) return <time className="live-date">—</time>;

  const date = new Date(`${today}T12:00:00`);
  const sinceMonday = (date.getDay() + 6) % 7;
  if (value === "weekStart") date.setDate(date.getDate() - sinceMonday);
  if (value === "nextReview") date.setDate(date.getDate() + 7 - sinceMonday);
  const label = date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: year ? "numeric" : undefined,
    weekday: weekday ? "short" : undefined,
  });
  const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  return (
    <time className="live-date" dateTime={iso}>
      {uppercase ? label.toUpperCase() : label}
    </time>
  );
}
