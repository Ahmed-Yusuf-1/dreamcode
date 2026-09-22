"use client";

import { useEffect, useState } from "react";
import { acceptGuestMerge, declineGuestMerge, GUEST_MERGE_EVENT, pendingGuestMergeCount } from "@/lib/profile";

/**
 * After signing in, a learner who made progress as a guest on this device is
 * asked whether to bring it into their account. Nothing is merged silently: the
 * choice is explicit, and the server re-validates every completion it receives.
 */
export default function GuestMergePrompt() {
  const [count, setCount] = useState(0);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<number | null>(null);

  useEffect(() => {
    const refresh = () => setTimeout(() => setCount(pendingGuestMergeCount()), 0);
    refresh();
    window.addEventListener(GUEST_MERGE_EVENT, refresh);
    return () => window.removeEventListener(GUEST_MERGE_EVENT, refresh);
  }, []);

  if (done !== null) {
    return (
      <div role="status" className="dc-paper anim-pop-in fixed z-[60]" style={toastStyle}>
        <div className="font-display" style={{ fontWeight: 800, fontSize: 17 }}>
          {done > 0 ? `Added ${done} ${done === 1 ? "activity" : "activities"} to your account.` : "Your account already had that progress."}
        </div>
        <div style={{ marginTop: 12 }}>
          <button type="button" className="dc-btn dc-btn--quiet dc-btn--sm" onClick={() => setDone(null)}>
            Close
          </button>
        </div>
      </div>
    );
  }

  if (count === 0) return null;

  return (
    <div role="dialog" aria-labelledby="guest-merge-title" className="dc-paper anim-pop-in fixed z-[60]" style={toastStyle}>
      <div id="guest-merge-title" className="font-display" style={{ fontWeight: 800, fontSize: 18 }}>
        Keep what you did as a guest?
      </div>
      <p className="dc-ink-soft" style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.55, margin: "6px 0 14px" }}>
        This device has {count} completed {count === 1 ? "activity" : "activities"} from before you signed in. Add
        {count === 1 ? " it" : " them"} to your account?
      </p>
      <div className="flex flex-wrap" style={{ gap: 10 }}>
        <button
          type="button"
          className="dc-btn dc-btn--primary dc-btn--sm"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            const added = await acceptGuestMerge();
            setBusy(false);
            setCount(0);
            setDone(added);
          }}
        >
          {busy ? "Adding..." : "Add to my account"}
        </button>
        <button
          type="button"
          className="dc-btn dc-btn--quiet dc-btn--sm"
          disabled={busy}
          onClick={() => {
            declineGuestMerge();
            setCount(0);
          }}
        >
          No thanks
        </button>
      </div>
    </div>
  );
}

const toastStyle: React.CSSProperties = {
  right: 18,
  bottom: 18,
  width: "min(360px, calc(100vw - 36px))",
  padding: "18px 20px",
};
