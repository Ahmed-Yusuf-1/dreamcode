/** The tiny teardrop flame used in streak chips. */
export default function StreakFlame() {
  return (
    <span
      style={{
        display: "inline-block",
        width: 10,
        height: 14,
        background: "linear-gradient(180deg,#ffd56b,#ff8a5c)",
        borderRadius: "50% 50% 50% 0",
        transform: "rotate(-45deg)",
      }}
    />
  );
}
