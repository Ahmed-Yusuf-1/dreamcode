import RichText from "@/components/ui/RichText";

type Block =
  | { kind: "p"; text: string }
  | { kind: "ul" | "ol"; items: string[] }
  | { kind: "code"; code: string };

/** Splits a brief into paragraphs, bullet or numbered lists, and fenced code. */
function parse(source: string): Block[] {
  const blocks: Block[] = [];
  const lines = source.replace(/\r/g, "").split("\n");
  let para: string[] = [];
  const flush = () => {
    if (para.length) blocks.push({ kind: "p", text: para.join(" ") });
    para = [];
  };
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (/^```/.test(line.trim())) {
      flush();
      const code: string[] = [];
      i += 1;
      while (i < lines.length && !/^```/.test(lines[i].trim())) {
        code.push(lines[i]);
        i += 1;
      }
      blocks.push({ kind: "code", code: code.join("\n") });
      continue;
    }
    const bullet = line.match(/^\s*[-*]\s+(.*)$/);
    const numbered = line.match(/^\s*\d+[.)]\s+(.*)$/);
    if (bullet || numbered) {
      flush();
      const kind = bullet ? "ul" : "ol";
      const last = blocks[blocks.length - 1];
      const text = (bullet ?? numbered)![1];
      if (last && last.kind === kind) last.items.push(text);
      else blocks.push({ kind, items: [text] });
      continue;
    }
    if (line.trim() === "") {
      flush();
      continue;
    }
    para.push(line.trim());
  }
  flush();
  return blocks;
}

/** Renders task briefs: paragraphs, lists and code blocks with inline **bold** and `code`. */
export default function Prose({ text, fontSize = 15 }: { text: string; fontSize?: number }) {
  return (
    <div className="dc-prose" style={{ fontSize, display: "flex", flexDirection: "column", gap: 10 }}>
      {parse(text).map((block, i) => {
        if (block.kind === "p") {
          return (
            <p key={i} style={{ margin: 0 }}>
              <RichText text={block.text} />
            </p>
          );
        }
        if (block.kind === "code") {
          return (
            <pre key={i} className="dc-code" style={{ margin: 0, padding: "12px 14px", fontSize: 12.5, lineHeight: 1.7, overflowX: "auto" }}>
              {block.code}
            </pre>
          );
        }
        const List = block.kind;
        return (
          <List key={i} style={{ margin: 0, paddingLeft: 22, display: "flex", flexDirection: "column", gap: 4, listStyle: block.kind === "ul" ? "disc" : "decimal" }}>
            {block.items.map((item, j) => (
              <li key={j}>
                <RichText text={item} />
              </li>
            ))}
          </List>
        );
      })}
    </div>
  );
}
