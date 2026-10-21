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
        className="font-display font-black text-5xl md:text-6xl text-slate-900 tracking-wide mb-10"
      >
        文章列表
      </motion.h1>

      <div className="sticky top-24 z-30 glass rounded-3xl py-4 px-4 sm:px-5 mb-8">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="搜索文章..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/60 backdrop-blur border border-white/60 rounded-full text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-primary/60 focus:bg-white/80 transition-colors"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white/60 backdrop-blur border border-white/60 rounded-full text-sm text-text-muted hover:text-primary hover:border-primary/50 transition-colors"
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
            className="mt-3 pt-3 border-t border-white/50 space-y-3"
          >
            <div>
              <span className="text-xs text-text-muted mb-2 block">分类</span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory("")}
                  className={`px-3.5 py-1.5 rounded-full text-xs border backdrop-blur transition-colors ${
                    !selectedCategory
                      ? "bg-primary text-white border-primary"
                      : "bg-white/50 text-text-muted border-white/60 hover:border-primary/50 hover:text-primary"
                  }`}
                >
                  全部
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs border backdrop-blur transition-colors ${
                      selectedCategory === cat.id
                        ? "text-white border-transparent"
                        : "bg-white/50 text-text-muted border-white/60 hover:border-primary/50 hover:text-primary"
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
                  className={`px-3.5 py-1.5 rounded-full text-xs border backdrop-blur transition-colors ${
                    !selectedTag
                      ? "bg-primary text-white border-primary"
                      : "bg-white/50 text-text-muted border-white/60 hover:border-primary/50 hover:text-primary"
                  }`}
                >
                  全部
                </button>
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => setSelectedTag(tag.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs border backdrop-blur transition-colors ${
                      selectedTag === tag.id
                        ? "bg-secondary text-white border-secondary"
                        : "bg-white/50 text-text-muted border-white/60 hover:border-secondary/60 hover:text-secondary"
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
