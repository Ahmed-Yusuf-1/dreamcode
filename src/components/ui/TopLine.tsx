import Link from "next/link";

/** Hub page top row: a back pill on the left and actions on the right. */
export default function TopLine({
  back = { href: "/dashboard", label: "Dashboard" },
  right,
}: {
  back?: { href: string; label: string } | null;
  right?: React.ReactNode;
}) {
  return (
    <div className="dc-topline">
      {back ? (
        <Link href={back.href} className="dc-pill">
          {"←"} {back.label}
        </Link>
      ) : (
        <span />
      )}
      <div className="flex flex-wrap items-center justify-end" style={{ gap: 10 }}>
        {right}
      </div>
    </div>
  );
}
