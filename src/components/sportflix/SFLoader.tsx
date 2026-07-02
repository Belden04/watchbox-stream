/**
 * SFLoader — small rotating "SF" mark used for page-loading states.
 * Two sizes: default (page), sm (inline).
 */
type Props = {
  size?: "sm" | "md" | "lg";
  label?: string;
  className?: string;
};

const SIZE_MAP = {
  sm: { box: "size-8", text: "text-[10px]" },
  md: { box: "size-14", text: "text-sm" },
  lg: { box: "size-20", text: "text-lg" },
} as const;

export function SFLoader({ size = "md", label, className = "" }: Props) {
  const s = SIZE_MAP[size];
  return (
    <div className={`inline-flex flex-col items-center gap-2 ${className}`}>
      <div className={`relative ${s.box}`}>
        {/* Outer orbit ring */}
        <span className="absolute inset-0 animate-[sfspin_1.4s_linear_infinite] rounded-full border-2 border-transparent border-t-primary border-r-primary/50" />
        {/* Inner counter-orbit */}
        <span className="absolute inset-1 animate-[sfspin_2s_linear_infinite_reverse] rounded-full border border-transparent border-b-accent" />
        {/* SF mark */}
        <div className={`absolute inset-0 grid place-items-center font-display font-black tracking-tighter ${s.text}`}>
          <span className="text-primary">S</span>
          <span className="text-foreground -ml-0.5">F</span>
        </div>
      </div>
      {label && (
        <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-muted-foreground">
          {label}
        </span>
      )}
      <style>{`@keyframes sfspin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

export function SFFullPageLoader({ label = "Loading" }: { label?: string }) {
  return (
    <div className="grid min-h-[60vh] w-full place-items-center">
      <SFLoader size="lg" label={label} />
    </div>
  );
}
