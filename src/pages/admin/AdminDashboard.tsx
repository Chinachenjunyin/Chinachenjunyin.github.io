import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, FolderOpen, Tags, Plus, TrendingUp } from "lucide-react";
import { useAppStore } from "@/context/AppContext";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";

export default function AdminDashboard() {
  const articles = useAppStore((s) => s.articles);
  const categories = useAppStore((s) => s.categories);
  const tags = useAppStore((s) => s.tags);

  const stats = [
    {
      label: "总文章数",
      value: articles.length,
      icon: FileText,
      color: "#FF6B35",
      link: "/admin/articles",
    },
    {
      label: "总分类数",
      value: categories.length,
      icon: FolderOpen,
      color: "#00D9FF",
      link: "/admin/categories",
    },
    {
      label: "总标签数",
      value: tags.length,
      icon: Tags,
      color: "#A855F7",
      link: "/admin/tags",
    },
    {
      label: "本月新增",
      value: articles.filter((a) => {
        const date = new Date(a.createdAt);
        const now = new Date();
        return (
          date.getMonth() === now.getMonth() &&
          date.getFullYear() === now.getFullYear()
        );
      }).length,
      icon: TrendingUp,
      color: "#22C55E",
      link: "/admin/articles",
    },
  ];

  const recentArticles = articles.slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              to={stat.link}
              className="block p-6 bg-surface rounded-xl border border-border hover:border-opacity-100 transition-all group"
              style={{
                borderColor: "transparent",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = stat.color;
                (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${stat.color}20`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "transparent";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <stat.icon
                  className="w-5 h-5"
                  style={{ color: stat.color }}
                />
                <span className="text-xs text-text-muted">{stat.label}</span>
              </div>
              <p
                className="font-display text-5xl tracking-wider"
                style={{ color: stat.color }}
              >
                {stat.value}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-text">最近文章</h2>
            <Link
              to="/admin/articles"
              className="text-sm text-primary hover:underline"
            >
              查看全部
            </Link>
          </div>

          <div className="space-y-3">
            {recentArticles.map((article) => {
              const category = categories.find(
                (c) => c.id === article.categoryId
              );
              return (
                <div
                  key={article.id}
                  className="flex items-center gap-4 p-3 bg-background rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-text truncate">
                      {article.title}
                    </h3>
                    <p className="text-xs text-text-muted mt-0.5">
                      {format(new Date(article.createdAt), "yyyy-MM-dd", {
                        locale: zhCN,
                      })}
                      {category && (
                        <span
                          className="ml-2 px-1.5 py-0.5 rounded text-[10px]"
                          style={{
                            backgroundColor: `${category.color}20`,
                            color: category.color,
                          }}
                        >
                          {category.name}
                        </span>
                      )}
                    </p>
                  </div>
                  <Link
                    to={`/admin/articles/edit/${article.id}`}
                    className="text-xs text-text-muted hover:text-primary transition-colors flex-shrink-0"
                  >
                    编辑
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-surface rounded-xl border border-border p-6">
          <h2 className="text-lg font-bold text-text mb-6">快捷操作</h2>
          <div className="space-y-3">
            <Link
              to="/admin/articles/new"
              className="flex items-center gap-3 p-3 bg-background rounded-lg hover:bg-primary/10 transition-colors group"
            >
              <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Plus className="w-4 h-4 text-primary" />
              </div>
              <span className="text-sm text-text">新增文章</span>
            </Link>
            <Link
              to="/admin/categories"
              className="flex items-center gap-3 p-3 bg-background rounded-lg hover:bg-secondary/10 transition-colors group"
            >
              <div className="w-8 h-8 rounded bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                <FolderOpen className="w-4 h-4 text-secondary" />
              </div>
              <span className="text-sm text-text">管理分类</span>
            </Link>
            <Link
              to="/admin/tags"
              className="flex items-center gap-3 p-3 bg-background rounded-lg hover:bg-purple-500/10 transition-colors group"
            >
              <div className="w-8 h-8 rounded bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                <Tags className="w-4 h-4 text-purple-400" />
              </div>
              <span className="text-sm text-text">管理标签</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
