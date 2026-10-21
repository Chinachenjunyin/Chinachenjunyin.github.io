import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Eye, Tag } from "lucide-react";
import MarkdownRenderer from "@/components/shared/MarkdownRenderer";
import { useAppStore } from "@/context/AppContext";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";

export default function ArticleDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const articles = useAppStore((s) => s.articles);
  const categories = useAppStore((s) => s.categories);
  const tags = useAppStore((s) => s.tags);
  const [progress, setProgress] = useState(0);

  const article = useMemo(
    () => articles.find((a) => a.id === id),
    [articles, id]
  );

  const category = useMemo(
    () => categories.find((c) => c.id === article?.categoryId),
    [categories, article]
  );

  const articleTags = useMemo(
    () => tags.filter((t) => article?.tagIds.includes(t.id)),
    [tags, article]
  );

  const relatedArticles = useMemo(() => {
    if (!article) return [];
    return articles
      .filter(
        (a) => a.categoryId === article.categoryId && a.id !== article.id
      )
      .slice(0, 3);
  }, [articles, article]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, scrollPercent)));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display font-black text-4xl text-slate-900 mb-4">文章未找到</h1>
          <button
            onClick={() => navigate("/articles")}
            className="text-primary hover:underline"
          >
            返回文章列表
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Reading progress */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-[3px] bg-white/40">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-secondary"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Cover */}
      {article.cover && (
        <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
          <img
            src={article.cover}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#EEF0FA] via-white/20 to-transparent" />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-20 relative z-10">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors mb-6 bg-white/60 backdrop-blur border border-white/50 rounded-full pl-3 pr-4 py-2 shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">返回</span>
        </motion.button>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass rounded-[2rem] p-6 sm:p-10 mb-16"
        >
          {category && (
            <span className="inline-block text-xs px-3 py-1 rounded-full font-medium mb-4 bg-indigo-500/10 text-indigo-600 border border-indigo-200/60 backdrop-blur">
              {category.name}
            </span>
          )}

          <h1 className="font-display font-black text-4xl md:text-5xl text-slate-900 tracking-wide mb-6">
            {article.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-text-muted mb-10 pb-10 border-b border-border">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {format(new Date(article.createdAt), "yyyy年M月d日", {
                locale: zhCN,
              })}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {article.viewCount} 阅读
            </span>
          </div>

          <div className="mb-10">
            <MarkdownRenderer content={article.content} />
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-8 border-t border-white/50">
            <Tag className="w-4 h-4 text-text-muted" />
            {articleTags.map((tag) => (
              <Link
                key={tag.id}
                to={`/articles?tag=${tag.id}`}
                className="text-xs px-3 py-1 rounded-full bg-white/50 border border-white/60 text-text-muted hover:text-primary hover:border-primary/40 transition-colors"
              >
                {tag.name}
              </Link>
            ))}
          </div>
        </motion.article>

        {/* Related articles */}
        {relatedArticles.length > 0 && (
          <div className="pb-20">
            <h2 className="font-display font-black text-3xl text-slate-900 tracking-wide mb-6">
              相关推荐
            </h2>
            <div className="space-y-4">
              {relatedArticles.map((ra) => {
                const raCat = categories.find((c) => c.id === ra.categoryId);
                return (
                  <Link
                    key={ra.id}
                    to={`/article/${ra.id}`}
                    className="flex items-center gap-4 p-4 bg-white/60 backdrop-blur-xl rounded-2xl border border-white/50 shadow-lg shadow-indigo-500/5 hover:border-primary/40 hover:-translate-y-0.5 transition-all group"
                  >
                    {ra.cover && (
                      <img
                        src={ra.cover}
                        alt={ra.title}
                        className="w-20 h-14 object-cover rounded-xl flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-text font-medium group-hover:text-primary transition-colors truncate">
                        {ra.title}
                      </h3>
                      <p className="text-xs text-text-muted mt-1 line-clamp-1">
                        {ra.summary}
                      </p>
                    </div>
                    {raCat && (
                      <span className="text-xs px-2.5 py-1 rounded-full flex-shrink-0 bg-indigo-500/10 text-indigo-600 border border-indigo-200/60">
                        {raCat.name}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
