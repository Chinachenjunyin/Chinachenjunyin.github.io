import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import ArticleCard from "@/components/shared/ArticleCard";
import { useAppStore } from "@/context/AppContext";

export default function ArticleList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const articles = useAppStore((s) => s.articles);
  const categories = useAppStore((s) => s.categories);
  const tags = useAppStore((s) => s.tags);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || ""
  );
  const [selectedTag, setSelectedTag] = useState(searchParams.get("tag") || "");
  const [showFilters, setShowFilters] = useState(false);

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesSearch =
        !searchQuery ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        !selectedCategory || article.categoryId === selectedCategory;
      const matchesTag =
        !selectedTag || article.tagIds.includes(selectedTag);
      return matchesSearch && matchesCategory && matchesTag;
    });
  }, [articles, searchQuery, selectedCategory, selectedTag]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedTag("");
    setSearchParams({});
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display text-5xl md:text-6xl text-text tracking-wider mb-10"
      >
        文章列表
      </motion.h1>

      <div className="sticky top-16 z-30 bg-background/95 backdrop-blur-sm py-4 -mx-4 px-4 sm:mx-0 sm:px-0 border-b border-border mb-8">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="搜索文章..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-surface border border-border rounded text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-surface border border-border rounded text-sm text-text-muted hover:text-text hover:border-primary transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            筛选
          </button>
        </div>

        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 pt-3 border-t border-border space-y-3"
          >
            <div>
              <span className="text-xs text-text-muted mb-2 block">分类</span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory("")}
                  className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                    !selectedCategory
                      ? "bg-primary text-white border-primary"
                      : "bg-surface text-text-muted border-border hover:border-primary"
                  }`}
                >
                  全部
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                      selectedCategory === cat.id
                        ? "text-white border-transparent"
                        : "bg-surface text-text-muted border-border hover:border-primary"
                    }`}
                    style={
                      selectedCategory === cat.id
                        ? { backgroundColor: cat.color }
                        : {}
                    }
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs text-text-muted mb-2 block">标签</span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedTag("")}
                  className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                    !selectedTag
                      ? "bg-primary text-white border-primary"
                      : "bg-surface text-text-muted border-border hover:border-primary"
                  }`}
                >
                  全部
                </button>
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => setSelectedTag(tag.id)}
                    className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                      selectedTag === tag.id
                        ? "bg-secondary text-background border-secondary"
                        : "bg-surface text-text-muted border-border hover:border-secondary"
                    }`}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>

            {(searchQuery || selectedCategory || selectedTag) && (
              <button
                onClick={clearFilters}
                className="text-xs text-primary hover:underline"
              >
                清除筛选
              </button>
            )}
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((article, index) => {
          const category = categories.find((c) => c.id === article.categoryId);
          const articleTags = tags.filter((t) => article.tagIds.includes(t.id));
          return (
            <ArticleCard
              key={article.id}
              article={article}
              category={category}
              tags={articleTags}
              index={index}
            />
          );
        })}
      </div>

      {filteredArticles.length === 0 && (
        <div className="text-center py-20">
          <p className="text-text-muted">没有找到匹配的文章</p>
        </div>
      )}
    </div>
  );
}
