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
        <div className="bg-surface rounded-lg overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_8px_30px_rgba(255,107,53,0.15)]">
          {article.cover && (
            <div className="aspect-video overflow-hidden">
              <img
                src={article.cover}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          )}
          <div className="p-5">
            <div className="flex items-center gap-3 mb-3">
              {category && (
                <span
                  className="text-xs px-2 py-0.5 rounded font-medium"
                  style={{
                    backgroundColor: `${category.color}20`,
                    color: category.color,
                  }}
                >
                  {category.name}
                </span>
              )}
              <span className="flex items-center gap-1 text-xs text-text-muted">
                <Calendar className="w-3 h-3" />
                {format(new Date(article.createdAt), "yyyy年M月d日", {
                  locale: zhCN,
                })}
              </span>
            </div>

            <h3 className="text-lg font-bold text-text group-hover:text-primary transition-colors line-clamp-2 mb-2">
              {article.title}
            </h3>

            <p className="text-sm text-text-muted line-clamp-2 mb-4">
              {article.summary}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1.5">
                {tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag.id}
                    className="text-xs px-2 py-0.5 rounded-full bg-surface-light text-text-muted"
                  >
                    {tag.name}
                  </span>
                ))}
                {tags.length > 2 && (
                  <span className="text-xs text-text-muted">
                    +{tags.length - 2}
                  </span>
                )}
              </div>
              <span className="flex items-center gap-1 text-xs text-text-muted">
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
