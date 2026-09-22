"use client";

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { buildPreviewDocument, DOM_MESSAGE_TAG } from "@/lib/domPreview";

export interface DomRunResult {
  ok: boolean;
  lines: string[];
  errorLines: string[];
}

export interface DomPreviewHandle {
  /** Loads a fresh page with the given (already instrumented) script and waits for it to finish. */
  run: (js: string) => Promise<DomRunResult>;
}

interface Props {
  html: string;
  /** Output that arrives after the run finished (clicks, timers). */
  onLateOutput?: (lines: string[], errorLines: string[]) => void;
}

const RUN_TIMEOUT_MS = 4000;

function newToken() {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
}

/**
 * A live page for DOM lessons. The learner's script runs inside a sandboxed,
 * opaque-origin iframe, so it can change this little page but nothing else.
 */
const DomPreview = forwardRef<DomPreviewHandle, Props>(function DomPreview({ html, onLateOutput }, ref) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const tokenRef = useRef(newToken());
  const [doc, setDoc] = useState(() => buildPreviewDocument(html, null, tokenRef.current));
  const [runKey, setRunKey] = useState(0);
  const collecting = useRef<{ lines: string[]; errors: string[]; resolve: (r: DomRunResult) => void; timer: ReturnType<typeof setTimeout> } | null>(null);
  const lateRef = useRef(onLateOutput);

  useEffect(() => {
    lateRef.current = onLateOutput;
  }, [onLateOutput]);

  const finish = useCallback(() => {
    const c = collecting.current;
    if (!c) return;
    clearTimeout(c.timer);
    collecting.current = null;
    c.resolve({ ok: c.errors.length === 0, lines: c.lines, errorLines: c.errors });
  }, []);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      const data = event.data as { tag?: string; token?: string; kind?: string; text?: string } | null;
      if (!data || data.tag !== DOM_MESSAGE_TAG || data.token !== tokenRef.current) return;
      if (event.source !== iframeRef.current?.contentWindow) return;
      const text = String(data.text ?? "");
      const c = collecting.current;
      if (data.kind === "done") {
        finish();
        return;
      }
      if (c) {
        if (data.kind === "error") c.errors.push(text);
        else c.lines.push(text);
      } else if (data.kind === "error") {
        lateRef.current?.([], [text]);
      } else {
        lateRef.current?.([text], []);
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [finish]);

  useImperativeHandle(
    ref,
    () => ({
      run: (js: string) =>
        new Promise<DomRunResult>((resolve) => {
          if (collecting.current) finish();
          const token = newToken();
          tokenRef.current = token;
          collecting.current = {
            lines: [],
            errors: [],
            resolve,
            timer: setTimeout(() => {
              const c = collecting.current;
              if (c) c.errors.push("The page did not finish loading. Your script may be stuck.");
              finish();
            }, RUN_TIMEOUT_MS),
          };
          setDoc(buildPreviewDocument(html, js, token));
          setRunKey((k) => k + 1);
        }),
    }),
    [finish, html],
  );

  return (
    <div className="overflow-hidden" style={{ borderRadius: 16, border: "1px solid rgba(255,255,255,.18)", boxShadow: "0 18px 40px rgba(10,20,60,.3)" }}>
      <div className="flex items-center justify-between" style={{ background: "var(--dc-code-bg)", padding: "8px 14px", gap: 10 }}>
        <span className="font-mono" style={{ fontSize: 11.5, color: "#9db8e8" }}>
          preview {"·"} index.html
        </span>
        <span style={{ fontSize: 11, fontWeight: 800, color: "#9db8e8" }}>live page, click around after you run</span>
      </div>
      <iframe
        key={runKey}
        ref={iframeRef}
        title="Page preview"
        sandbox="allow-scripts"
        srcDoc={doc}
        style={{ display: "block", width: "100%", height: 220, border: "none", background: "#fffaf6" }}
      />
    </div>
  );
});

export default DomPreview;
