type Props = { size?: number; className?: string };

/** The SPORTFLIX "SF" mark — used everywhere (navbar, footer, favicon, splash). */
export function WBMark({ size = 36, className = "" }: Props) {
  return (
    <span
      className={`relative inline-grid place-items-center rounded-md ${className}`}
      style={{ width: size, height: size }}
      aria-label="SPORTFLIX"
    >
      <span
        className="absolute inset-0 rounded-md"
        style={{
          background:
            "linear-gradient(135deg, var(--color-primary) 0%, #ff8a3d 60%, #ffb066 100%)",
          boxShadow: "0 0 18px -4px var(--color-primary)",
        }}
      />
      <span
        className="relative font-display font-black tracking-tighter text-black"
        style={{ fontSize: size * 0.55, lineHeight: 1, transform: "translateY(-1px)" }}
      >
        SF
      </span>
    </span>
  );
}
