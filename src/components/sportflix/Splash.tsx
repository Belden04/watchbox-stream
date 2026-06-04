import { useEffect, useState } from "react";

export function Splash() {
  const [hidden, setHidden] = useState(false);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setFade(true), 1200);
    const t2 = setTimeout(() => setHidden(true), 1700);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (hidden) return null;
  return (
    <div
      className={`fixed inset-0 z-[100] grid place-items-center bg-black transition-opacity duration-500 ${
        fade ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center gap-5">
        <div className="font-display flex items-end gap-1 text-[5rem] font-black leading-none tracking-tighter drop-shadow-[0_0_40px_rgba(234,128,30,0.6)] md:text-[7rem]">
          <span className="inline-block animate-[sfbounce_0.9s_ease-in-out_infinite] text-primary">S</span>
          <span
            className="inline-block animate-[sfbounce_0.9s_ease-in-out_infinite] text-foreground"
            style={{ animationDelay: "0.15s" }}
          >
            F
          </span>
        </div>
        <div className="font-display text-xs font-black tracking-[0.5em] text-muted-foreground md:text-sm">
          SPORT<span className="text-primary">FLIX</span>
        </div>
      </div>
      <style>{`@keyframes sfbounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-22px)}}`}</style>
    </div>
  );
}
