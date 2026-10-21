import { useEffect, useState } from "react";

export default function ClockCard() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white/40 backdrop-blur-md border border-white/40 shadow-xl rounded-3xl transition duration-500 hover:scale-[1.01] sm:col-span-1 p-5 flex flex-col items-center justify-center text-center gap-1">
      <div className="font-display font-black text-3xl text-slate-900 tabular-nums">
        {now.toLocaleTimeString("zh-CN", { hour12: false })}
      </div>
      <div className="text-sm text-slate-600">
        {now.toLocaleDateString("zh-CN", {
          year: "numeric",
          month: "long",
          day: "numeric",
          weekday: "long",
        })}
      </div>
      <p className="text-xs text-text-muted mt-2">记录思考，探索生活</p>
    </div>
  );
}
