import { useEffect, useState } from "react";
import { WBMark } from "./WBMark";

export function Splash() {
  const [hidden, setHidden] = useState(false);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setFade(true), 1200);
    const t2 = setTimeout(() => setHidden(true), 1700);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (hidden) return null;
  return (
    <div
      className={`fixed inset-0 z-[100] grid place-items-center bg-black transition-opacity duration-500 ${
        fade ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <span className="absolute inset-0 -m-4 animate-[wbring_1.6s_linear_infinite] rounded-full border-2 border-transparent border-t-[#1e5bff] border-r-[#1e5bff]/40" />
          <span className="absolute inset-0 -m-8 animate-[wbring_2.4s_linear_infinite_reverse] rounded-full border border-transparent border-b-white/30" />
          <div className="animate-[wbbounce_1.1s_ease-in-out_infinite]">
            <WBMark size={110} />
          </div>
        </div>
        <div className="font-display text-sm font-black tracking-[0.45em] text-white/80">
          WATCH<span className="text-[#5a8dff]">BOX</span><span className="text-[#5a8dff]">7</span>
        </div>
      </div>
      <style>{`
        @keyframes wbbounce { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-14px) scale(1.03)} }
        @keyframes wbring { to { transform: rotate(360deg) } }
      `}</style>
    </div>
  );
}
