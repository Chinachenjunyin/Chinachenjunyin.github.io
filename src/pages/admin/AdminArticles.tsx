import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Search, Pencil, Trash2, AlertCircle } from "lucide-react";
import { useAppStore } from "@/context/AppContext";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";

export default function AdminArticles() {
  const articles = useAppStore((s) => s.articles);
  const categories = useAppStore((s) => s.categories);
  const deleteArticle = useAppStore((s) => s.deleteArticle);

  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filteredArticles = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (deleteConfirm === id) {
      deleteArticle(id);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="font-display text-3xl text-text tracking-wider">
          文章管理
        </h1>
        <Link
          to="/admin/articles/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:shadow-[0_0_20px_rgba(255,107,53,0.4)] transition-all"
        >
          <Plus className="w-4 h-4" />
          新增文章
        </Link>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input
          type="text"
          placeholder="搜索文章..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-surface border border-border rounded-lg text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-light/50">
                <th className="text-left px-4 py-3 text-text-muted font-medium">
                  标题
                </th>
                <th className="text-left px-4 py-3 text-text-muted font-medium">
                  分类
                </th>
                <th className="text-left px-4 py-3 text-text-muted font-medium">
                  发布时间
                </th>
                <th className="text-left px-4 py-3 text-text-muted font-medium">
                  阅读
                </th>
                <th className="text-right px-4 py-3 text-text-muted font-medium">
                  操作
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredArticles.map((article) => {
                const category = categories.find(
                  (c) => c.id === article.categoryId
                );
                return (
                  <tr
                    key={article.id}
                    className="border-b border-border hover:bg-background/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-text max-w-xs truncate">
                        {article.title}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {category && (
                        <span
                          className="text-xs px-2 py-0.5 rounded"
                          style={{
                            backgroundColor: `${category.color}20`,
                            color: category.color,
                          }}
                        >
                          {category.name}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-text-muted">
                      {format(new Date(article.createdAt), "yyyy-MM-dd", {
                        locale: zhCN,
                      })}
                    </td>
                    <td className="px-4 py-3 text-text-muted">
                      {article.viewCount}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/articles/edit/${article.id}`}
                          className="p-1.5 text-text-muted hover:text-primary transition-colors"
                          title="编辑"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(article.id)}
                          className={`p-1.5 transition-colors ${
                            deleteConfirm === article.id
                              ? "text-primary"
                              : "text-text-muted hover:text-primary"
                          }`}
                          title={
                            deleteConfirm === article.id
                              ? "再次点击确认删除"
                              : "删除"
                          }
                        >
                          {deleteConfirm === article.id ? (
                            <AlertCircle className="w-4 h-4" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-text-muted text-sm">没有找到文章</p>
          </div>
        )}
      </div>
    </div>
  );
}
