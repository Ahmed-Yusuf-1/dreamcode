import Link from "next/link";

/**
 * The sticky bar under the global nav for focused flows (lesson, practice,
 * challenge, project, review, placement): a back link, a title with optional
 * meta, and an optional right-hand slot (usually the reward chip).
 */
export default function FlowBar({
  back,
  title,
  meta,
  right,
}: {
  back?: { href: string; label: string };
  title?: React.ReactNode;
  meta?: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <div className="dc-bar">
      {back ? (
        <Link href={back.href} className="dc-pill">
          {"←"} {back.label}
        </Link>
      ) : (
        <span />
      )}
      {(title || meta) && (
        <div className="dc-bar__center">
          {title && <div className="dc-bar__title">{title}</div>}
          {meta}
        </div>
      )}
      {right ?? <span />}
    </div>
  );
}
