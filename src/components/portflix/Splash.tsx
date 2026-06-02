import { useEffect, useState } from "react";
import logo from "@/assets/portflix-logo.png.asset.json";

export function Splash() {
  const [hidden, setHidden] = useState(false);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setFade(true), 1400);
    const t2 = setTimeout(() => setHidden(true), 2000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (hidden) return null;
  return (
    <div
      className={`fixed inset-0 z-[100] grid place-items-center bg-black transition-opacity duration-500 ${
        fade ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center gap-6">
        <img
          src={logo.url}
          alt="PORTFLIX"
          className="h-32 w-auto animate-pulse drop-shadow-[0_0_40px_rgba(234,128,30,0.6)] md:h-48"
        />
        <div className="font-display text-3xl font-black tracking-[0.4em] text-primary md:text-4xl">
          PORT<span className="text-foreground">FLIX</span>
        </div>
        <div className="h-0.5 w-48 overflow-hidden rounded-full bg-surface-2">
          <div className="h-full w-1/2 animate-[loading_1.4s_ease-in-out_infinite] bg-primary" />
        </div>
      </div>
      <style>{`@keyframes loading{0%{transform:translateX(-100%)}100%{transform:translateX(300%)}}`}</style>
    </div>
  );
}
