import { Fragment } from "react";

/**
 * Renders the curriculum's tiny inline markup: **bold** and `code`. Everything
 * else is plain text (no HTML is ever interpreted).
 */
export default function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+?\*\*|`[^`]+?`)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
          return (
            <strong key={i}>
              <RichText text={part.slice(2, -2)} />
            </strong>
          );
        }
        if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
          return (
            <code key={i} className="dc-inline-code">
              {part.slice(1, -1)}
            </code>
          );
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}
