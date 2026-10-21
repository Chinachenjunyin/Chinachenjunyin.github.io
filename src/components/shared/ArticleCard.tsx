import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Eye } from "lucide-react";
import { Article, Category, Tag } from "@/types";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";

interface ArticleCardProps {
  article: Article;
  category?: Category;
  tags: Tag[];
  index?: number;
}

export default function ArticleCard({
  article,
  category,
  tags,
  index = 0,
}: ArticleCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
    >
      <Link to={`/article/${article.id}`} className="group block">
        <div className="bg-white/40 backdrop-blur-md rounded-3xl overflow-hidden border border-white/40 shadow-xl transition duration-500 hover:scale-[1.01]">
          {article.cover && (
            <div className="aspect-video overflow-hidden relative">
              <img
                src={article.cover}
                alt=""
                aria-hidden
                className="absolute inset-0 w-full h-full object-cover blur-xl scale-110 opacity-70"
              />
              <img
                src={article.cover}
                alt={article.title}
                className="absolute inset-0 w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          )}
          <div className="p-6">
            <div className="flex items-center gap-3 mb-3">
              {category && (
                <span className="text-xs px-3 py-1 rounded-full font-medium bg-indigo-500/10 text-indigo-600 border border-indigo-200/60 backdrop-blur">
                  {category.name}
                </span>
              )}
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <Calendar className="w-3 h-3" />
                {format(new Date(article.createdAt), "yyyy年M月d日", {
                  locale: zhCN,
                })}
              </span>
            </div>

            <h3 className="font-display text-lg font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-2 mb-2">
              {article.title}
            </h3>

            <p className="text-sm text-slate-500 line-clamp-2 mb-4">
              {article.summary}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1.5">
                {tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag.id}
                    className="text-xs px-2.5 py-0.5 rounded-full bg-white/50 border border-white/60 text-slate-500"
                  >
                    {tag.name}
                  </span>
                ))}
                {tags.length > 2 && (
                  <span className="text-xs text-slate-400">
                    +{tags.length - 2}
                  </span>
                )}
              </div>
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <Eye className="w-3 h-3" />
                {article.viewCount}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
