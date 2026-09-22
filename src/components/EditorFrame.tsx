/**
 * The dusk-blue "window" that wraps code: traffic-light dots, filename, a
 * language pill (or toolbar), content, and an optional footer row.
 */
export default function EditorFrame({
  filename,
  language,
  children,
  footer,
  toolbar,
}: {
  filename: string;
  language: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  /** Small actions (Reset, Show solution) shown in the title bar. */
  toolbar?: React.ReactNode;
}) {
  return (
    <div
      className="overflow-hidden"
      style={{
        background: "var(--dc-code-bg)",
        border: "1px solid rgba(255,255,255,.12)",
        borderRadius: 20,
        boxShadow: "0 28px 56px rgba(10,20,60,.4)",
      }}
    >
      <div
        className="flex items-center justify-between"
        style={{ padding: "11px 16px", borderBottom: "1px solid rgba(255,255,255,.1)", gap: 10 }}
      >
        <div className="flex items-center" style={{ gap: 7, minWidth: 0 }}>
          <span aria-hidden="true" style={{ width: 10, height: 10, borderRadius: "50%", background: "#ffb6d9", flexShrink: 0 }} />
          <span aria-hidden="true" style={{ width: 10, height: 10, borderRadius: "50%", background: "#ffe49a", flexShrink: 0 }} />
          <span aria-hidden="true" style={{ width: 10, height: 10, borderRadius: "50%", background: "#a9ecc9", flexShrink: 0 }} />
          <span className="font-mono" style={{ fontSize: 12, color: "#9db8e8", marginLeft: 6, whiteSpace: "nowrap" }}>
            {filename}
          </span>
        </div>
        <div className="flex items-center" style={{ gap: 8 }}>
          {toolbar}
          <span
            style={{
              background: "rgba(255,255,255,.12)",
              color: "#bcd2f5",
              fontWeight: 900,
              fontSize: 11,
              padding: "4px 12px",
              borderRadius: 999,
              letterSpacing: ".6px",
            }}
          >
            {language}
          </span>
        </div>
      </div>
      {children}
      {footer}
    </div>
  );
}

/** Tiny text button for the editor title bar. */
export function EditorToolButton({
  onClick,
  children,
  label,
}: {
  onClick: () => void;
  children: React.ReactNode;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="cursor-pointer transition-colors hover:bg-white/20"
      style={{
        background: "rgba(255,255,255,.08)",
        border: "1px solid rgba(255,255,255,.16)",
        color: "#dbe9ff",
        fontWeight: 800,
        fontSize: 11.5,
        padding: "4px 10px",
        borderRadius: 999,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </button>
  );
}

export interface ConsoleNote {
  text: string;
  ok: boolean;
}

/** The dark console panel that sits under an editor. */
export function ConsolePanel({
  lines,
  note,
  errorLines,
  label = "Console",
  emptyText = "Run your code to see its output here.",
}: {
  lines: string[];
  note?: ConsoleNote;
  /** A readable traceback or compiler message, shown in red. */
  errorLines?: string[];
  label?: string;
  emptyText?: string;
}) {
  const hasOutput = lines.length > 0 || (errorLines && errorLines.length > 0);
  return (
    <div
      className="font-mono"
      role="log"
      aria-live="polite"
      aria-label={label}
      style={{
        background: "var(--dc-console-bg)",
        border: "1px solid rgba(255,255,255,.08)",
        borderRadius: 16,
        padding: "14px 18px",
        fontSize: 13,
        lineHeight: 1.8,
        color: "#d4e3ff",
        maxHeight: 360,
        overflowY: "auto",
      }}
    >
      <div style={{ fontSize: 11, letterSpacing: 1, color: "#6f88b8", fontWeight: 700, marginBottom: 6, textTransform: "uppercase" }}>
        {label}
      </div>
      {!hasOutput && !note && <div style={{ color: "#6f88b8" }}>{emptyText}</div>}
      {lines.map((l, i) => (
        <div key={i} style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
          {l === "" ? " " : l}
        </div>
      ))}
      {errorLines && errorLines.length > 0 && (
        <div style={{ color: "#ff9ecf", marginTop: lines.length ? 8 : 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
          {errorLines.join("\n")}
        </div>
      )}
      {note && (
        <div style={{ color: note.ok ? "#7fe0a8" : "#ffb3cf", marginTop: 6, fontFamily: "var(--font-nunito), sans-serif", fontWeight: 800 }}>
          {note.text}
        </div>
      )}
    </div>
  );
}
