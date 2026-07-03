type Props = {
  size?: number;
  className?: string;
  /** Show the "WATCHBOX7" wordmark under the circle */
  showWord?: boolean;
  variant?: "light" | "dark";
};

/**
 * WatchBox7 logo — white circular badge with stylized "WB" in black
 * and a bold blue "7" overlapping to the right. Used everywhere.
 */
export function WBMark({ size = 44, className = "", showWord = false, variant = "light" }: Props) {
  const bg = variant === "light" ? "#ffffff" : "#0a0a0a";
  const fg = variant === "light" ? "#0a0a0a" : "#ffffff";
  const accent = "#1e5bff";
  return (
    <span className={`inline-flex items-center gap-3 ${className}`} aria-label="WatchBox7">
      <span
        className="relative inline-grid shrink-0 place-items-center rounded-full shadow-[0_4px_18px_-4px_rgba(30,91,255,0.5)]"
        style={{ width: size, height: size, background: bg }}
      >
        <svg
          viewBox="0 0 64 64"
          width={size * 0.72}
          height={size * 0.72}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* W */}
          <path
            d="M6 20 L14 46 L22 28 L30 46 L38 20"
            stroke={fg}
            strokeWidth="4.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* B */}
          <path
            d="M40 20 H48 A6 6 0 0 1 48 32 H40 M40 32 H50 A6 6 0 0 1 50 46 H40 M40 20 V46"
            stroke={fg}
            strokeWidth="4.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* 7 */}
          <path
            d="M46 34 L58 34 L50 58"
            stroke={accent}
            strokeWidth="4.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {showWord && (
        <span className="font-display text-base font-black tracking-tight">
          Watch<span style={{ color: accent }}>Box</span>
          <span style={{ color: accent }}>7</span>
        </span>
      )}
    </span>
  );
}
