/** Centered page heading on the sky: optional kicker, glowing title, lede. */
export default function PageHeader({
  kicker,
  title,
  lede,
  children,
  align = "center",
}: {
  kicker?: React.ReactNode;
  title: React.ReactNode;
  lede?: React.ReactNode;
  children?: React.ReactNode;
  align?: "center" | "left";
}) {
  return (
    <header className={align === "center" ? "text-center" : "text-left"} style={{ marginBottom: 30 }}>
      {kicker && (
        <div className="dc-kicker" style={{ marginBottom: 10 }}>
          {kicker}
        </div>
      )}
      <h1 className="dc-title glow-heading">{title}</h1>
      {lede && (
        <p className="dc-lede" style={align === "left" ? { marginLeft: 0 } : undefined}>
          {lede}
        </p>
      )}
      {children}
    </header>
  );
}
