/**
 * The dusk-blue "window" that wraps code: traffic-light dots, filename,
 * language pill, content, and an optional footer row.
 */
export default function EditorFrame({
  filename,
  language,
  children,
  footer,
  glassy = false,
}: {
  filename: string;
  language: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  glassy?: boolean;
}) {
  return (
    <div
      className="overflow-hidden"
      style={{
        background: glassy ? "rgba(14,34,71,.94)" : "#0e2247",
        backdropFilter: glassy ? "blur(8px)" : undefined,
        border: glassy ? "1px solid rgba(255,255,255,.25)" : undefined,
        borderRadius: 20,
        boxShadow: glassy
          ? "0 28px 56px rgba(20,40,100,.4)"
          : "0 28px 56px rgba(20,50,120,.35)",
      }}
    >
      <div
        className="flex items-center justify-between"
        style={{ padding: "13px 18px", borderBottom: "1px solid rgba(255,255,255,.1)" }}
      >
        <div className="flex items-center" style={{ gap: 8 }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ffb6d9" }} />
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ffe49a" }} />
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#a9ecc9" }} />
          <span className="font-mono" style={{ fontSize: 12, color: "#9db8e8", marginLeft: 6 }}>
            {filename}
          </span>
        </div>
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
      {children}
      {footer}
    </div>
  );
}

/** The dark console panel that sits under an editor. */
export function ConsolePanel({
  lines,
  note,
}: {
  lines: string[];
  note?: { text: string; ok: boolean };
}) {
  return (
    <div
      className="font-mono"
      style={{
        background: "#081a38",
        borderRadius: 16,
        padding: "16px 20px",
        fontSize: 13,
        lineHeight: 1.9,
        color: "#bcd2f5",
      }}
    >
      <div style={{ fontSize: 11, letterSpacing: 1, color: "#48618f", fontWeight: 600, marginBottom: 6 }}>
        CONSOLE
      </div>
      {lines.length === 0 && <div style={{ color: "#48618f" }}>- run your code to see output -</div>}
      {lines.map((l, i) => (
        <div key={i}>{l}</div>
      ))}
      {note && (
        <div style={{ color: note.ok ? "#7fe0a8" : "#ff9ecf", marginTop: 6 }}>{note.text}</div>
      )}
    </div>
  );
}
