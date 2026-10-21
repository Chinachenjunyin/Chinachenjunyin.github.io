import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAppStore } from "@/context/AppContext";

export default function PostsCarousel() {
  const articles = useAppStore((s) => s.articles);
  const categories = useAppStore((s) => s.categories);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const pointRef = useRef<{ x: number; y: number } | null>(null);
  const suppressClickRef = useRef(false);

  const items = useMemo(
    () =>
      [...articles]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 5),
    [articles]
  );

  // index 变化时重置计时，手动切换后不会马上又被自动切走
  useEffect(() => {
    if (paused || items.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [paused, items.length, index]);

  if (items.length === 0) return null;

  const safeIndex = Math.min(index, items.length - 1);

  const goTo = (i: number) =>
    setIndex(((i % items.length) + items.length) % items.length);

  const handlePointerDown = (e: React.PointerEvent) => {
    pointRef.current = { x: e.clientX, y: e.clientY };
    setPaused(true);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    const start = pointRef.current;
    pointRef.current = null;
    setPaused(false);
    if (!start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    // 横向滑动超过 40px 且横向位移大于纵向时才算翻页
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      suppressClickRef.current = true;
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 100);
      goTo(dx < 0 ? safeIndex + 1 : safeIndex - 1);
    }
  };

  const handlePointerCancel = () => {
    pointRef.current = null;
    setPaused(false);
  };

  // 滑动翻页后拦下紧接着的点击，避免误进文章
  const handleClickCapture = (e: React.MouseEvent) => {
    if (suppressClickRef.current) {
      e.preventDefault();
      e.stopPropagation();
      suppressClickRef.current = false;
    }
  };

  const arrowClass =
    "absolute top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/25 backdrop-blur text-white hidden md:flex items-center justify-center opacity-0 hover:opacity-100 hover:bg-black/45 transition-all duration-300";

  return (
    <div
      className="lg:col-span-4 bg-white/40 backdrop-blur-md border border-white/40 shadow-xl rounded-3xl transition duration-500 hover:scale-[1.01] overflow-hidden relative min-h-[300px] p-0 select-none touch-pan-y cursor-grab active:cursor-grabbing"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onClickCapture={handleClickCapture}
    >
      {items.map((article, i) => {
        const category = categories.find((c) => c.id === article.categoryId);
        const active = i === safeIndex;
        return (
          <Link
            key={article.id}
            to={`/article/${article.id}`}
            className={`absolute inset-0 transition-opacity duration-700 ${
              active ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            <img
              src={article.cover || "/bg.jpg"}
              alt={article.title}
              draggable={false}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              {category && (
                <span className="inline-block bg-white/20 backdrop-blur text-white text-[11px] px-2 py-0.5 rounded-full mb-2">
                  {category.name}
                </span>
              )}
              <h3 className="text-white font-display font-bold text-xl leading-snug line-clamp-2">
                {article.title}
              </h3>
              <p className="text-white/70 text-xs mt-1.5">
                {format(new Date(article.createdAt), "yyyy年M月d日", {
                  locale: zhCN,
                })}
              </p>
            </div>
          </Link>
        );
      })}

      {items.length > 1 && (
        <>
          <button
            type="button"
            aria-label="上一张"
            onClick={() => goTo(safeIndex - 1)}
            className={`${arrowClass} left-3`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            aria-label="下一张"
            onClick={() => goTo(safeIndex + 1)}
            className={`${arrowClass} right-3`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      <div className="absolute bottom-4 right-5 z-20 flex items-center gap-1.5">
        {items.map((article, i) => (
          <button
            key={article.id}
            onClick={() => setIndex(i)}
            aria-label={`切换到第 ${i + 1} 篇`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === safeIndex ? "w-5 bg-white" : "w-1.5 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
