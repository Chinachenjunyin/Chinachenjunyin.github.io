import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { format } from "date-fns";
import { useAppStore } from "@/context/AppContext";

export default function HomeSearch() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const articles = useAppStore((s) => s.articles);

  const q = query.trim();
  const results = useMemo(() => {
    if (!q) return [];
    const lower = q.toLowerCase();
    return [...articles]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .filter(
        (a) =>
          a.title.toLowerCase().includes(lower) ||
          a.summary.toLowerCase().includes(lower)
      )
      .slice(0, 6);
  }, [articles, q]);

  return (
    <div className="max-w-2xl w-full mx-auto relative">
      <div className="relative">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") navigate("/articles");
          }}
          placeholder="搜索文章…"
          className="w-full pl-14 pr-6 py-4 rounded-3xl bg-white/50 backdrop-blur-xl border border-white/40 shadow-xl text-lg placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        />
      </div>

      {q && (
        <div className="absolute top-full mt-4 w-full rounded-3xl bg-white/90 backdrop-blur-3xl border border-white/50 shadow-2xl overflow-hidden z-20">
          {results.length > 0 ? (
            results.map((a) => (
              <button
                key={a.id}
                onClick={() => {
                  navigate(`/article/${a.id}`);
                  setQuery("");
                }}
                className="w-full flex items-center justify-between gap-4 px-5 py-3 text-left hover:bg-indigo-50/70 transition-colors"
              >
                <span className="font-medium text-slate-800 truncate">
                  {a.title}
                </span>
                <span className="text-xs text-slate-400 shrink-0">
                  {format(new Date(a.createdAt), "yyyy-MM-dd")}
                </span>
              </button>
            ))
          ) : (
            <p className="px-5 py-4 text-sm text-slate-500">没有找到相关文章</p>
          )}
        </div>
      )}
    </div>
  );
}
