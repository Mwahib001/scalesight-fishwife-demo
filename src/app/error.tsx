"use client";
export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="panel">
      <h1>Analysis unavailable; return to current plan.</h1>
      <button
        className="secondary-button"
        onClick={reset}
        style={{ marginTop: 24 }}
      >
        Reset to current plan
      </button>
    </div>
  );
}
