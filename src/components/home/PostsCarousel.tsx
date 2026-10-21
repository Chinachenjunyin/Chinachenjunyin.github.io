import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { useAppStore } from "@/context/AppContext";

export default function PostsCarousel() {
  const articles = useAppStore((s) => s.articles);
  const categories = useAppStore((s) => s.categories);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

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

  useEffect(() => {
    if (paused || items.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [paused, items.length]);

  if (items.length === 0) return null;

  const safeIndex = Math.min(index, items.length - 1);

  return (
    <div
      className="lg:col-span-4 bg-white/40 backdrop-blur-md border border-white/40 shadow-xl rounded-3xl transition duration-500 hover:scale-[1.01] overflow-hidden relative min-h-[300px] p-0"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
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
