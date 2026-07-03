/**
 * SFLoader — small rotating WatchBox7 mark used for page-loading states.
 * (Filename kept for backward-compat; renders WB7 logo.)
 */
import { WBMark } from "./WBMark";

type Props = {
  size?: "sm" | "md" | "lg";
  label?: string;
  className?: string;
};

const PX = { sm: 28, md: 56, lg: 88 } as const;

export function SFLoader({ size = "md", label, className = "" }: Props) {
  const px = PX[size];
  return (
    <div className={`inline-flex flex-col items-center gap-3 ${className}`}>
      <div className="relative" style={{ width: px, height: px }}>
        <span className="absolute inset-0 -m-1 animate-[wbspin_1.4s_linear_infinite] rounded-full border-2 border-transparent border-t-[#1e5bff] border-r-[#1e5bff]/40" />
        <span className="absolute inset-0 -m-3 animate-[wbspin_2.2s_linear_infinite_reverse] rounded-full border border-transparent border-b-white/25" />
        <div className="absolute inset-0 grid place-items-center">
          <WBMark size={px * 0.82} />
        </div>
      </div>
      {label && (
        <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-muted-foreground">
          {label}
        </span>
      )}
      <style>{`@keyframes wbspin{to{transform:rotate(360deg)}}`}</style>
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
