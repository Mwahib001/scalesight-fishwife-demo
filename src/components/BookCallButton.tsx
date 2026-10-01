"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { CalendarDays, X } from "lucide-react";

const calendlyUrl =
  process.env.NEXT_PUBLIC_CALENDLY_URL ||
  "https://calendly.com/kazmiarmanmehdi/30min";

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (options: {
        url: string;
        parentElement: HTMLElement;
      }) => void;
    };
  }
}

function BookingDialog({ onClose }: { onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const embedRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    const trigger = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
      trigger?.focus();
    };
  }, []);

  function initialize() {
    const parentElement = embedRef.current;
    if (!parentElement || !window.Calendly) {
      setStatus("error");
      return;
    }
    // onReady also runs when reopening after Next.js has cached the script.
    parentElement.replaceChildren();
    window.Calendly.initInlineWidget({ url: calendlyUrl, parentElement });
    setStatus("ready");
  }

  return (
    <dialog
      ref={dialogRef}
      className="booking-dialog"
      aria-labelledby="booking-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
    >
      <div className="booking-content">
        <header className="booking-header">
          <h2 id="booking-title">Book a call</h2>
          <button
            type="button"
            className="icon-button"
            aria-label="Close booking"
            onClick={onClose}
          >
            <X size={22} aria-hidden="true" />
          </button>
        </header>
        {status === "loading" && <p role="status">Loading available times…</p>}
        {status === "error" && (
          <p role="alert">
            Calendly could not load. Please refresh the page and try again, or{" "}
            <a href="mailto:arman@scalesight.org?subject=NATURANA%20Planning%20Pilot">
              email us
            </a>
            .
          </p>
        )}
        <div
          ref={embedRef}
          className="booking-embed"
          hidden={status === "error"}
        />
      </div>
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        onReady={initialize}
        onError={() => setStatus("error")}
      />
    </dialog>
  );
}

export function BookCallButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        className="button"
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
      >
        <CalendarDays size={16} aria-hidden="true" /> Book a call
      </button>
      {open && <BookingDialog onClose={() => setOpen(false)} />}
    </>
  );
}
