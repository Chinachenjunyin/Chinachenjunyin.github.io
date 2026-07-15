import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Save, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import MarkdownRenderer from "@/components/shared/MarkdownRenderer";
import { useAppStore } from "@/context/AppContext";
import { Article } from "@/types";

export default function AdminArticleEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const articles = useAppStore((s) => s.articles);
  const categories = useAppStore((s) => s.categories);
  const tags = useAppStore((s) => s.tags);
  const addArticle = useAppStore((s) => s.addArticle);
  const updateArticle = useAppStore((s) => s.updateArticle);

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [cover, setCover] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (isEdit && id) {
      const article = articles.find((a) => a.id === id);
      if (article) {
        setTitle(article.title);
        setSummary(article.summary);
        setContent(article.content);
        setCover(article.cover || "");
        setCategoryId(article.categoryId);
        setSelectedTagIds(article.tagIds);
      }
    }
  }, [isEdit, id, articles]);

  const toggleTag = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((t) => t !== tagId)
        : [...prev, tagId]
    );
  };

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return;

    const now = new Date().toISOString();
    const article: Article = {
      id: isEdit && id ? id : uuidv4(),
      title: title.trim(),
      summary: summary.trim() || title.trim(),
      content: content.trim(),
      categoryId: categoryId || categories[0]?.id || "",
      tagIds: selectedTagIds,
      cover: cover.trim() || undefined,
      createdAt: isEdit && id ? articles.find((a) => a.id === id)?.createdAt || now : now,
      updatedAt: now,
      viewCount: isEdit && id ? articles.find((a) => a.id === id)?.viewCount || 0 : 0,
    };

    if (isEdit) {
      updateArticle(article);
    } else {
      addArticle(article);
    }

    navigate("/admin/articles");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/admin/articles")}
          className="flex items-center gap-2 text-text-muted hover:text-text transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">返回</span>
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-lg text-sm text-text-muted hover:text-text transition-colors"
          >
            {showPreview ? (
              <>
                <EyeOff className="w-4 h-4" /> 隐藏预览
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" /> 预览
              </>
            )}
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim() || !content.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:shadow-[0_0_20px_rgba(255,107,53,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Save className="w-4 h-4" />
            保存
          </button>
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-border p-6 space-y-4">
        <div>
          <label className="block text-sm text-text-muted mb-1.5">标题</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-text focus:outline-none focus:border-primary transition-colors"
            placeholder="文章标题"
          />
        </div>

        <div>
          <label className="block text-sm text-text-muted mb-1.5">摘要</label>
          <input
            type="text"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-text focus:outline-none focus:border-primary transition-colors"
            placeholder="文章摘要（可选）"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-text-muted mb-1.5">
              分类
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-text focus:outline-none focus:border-primary transition-colors"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-text-muted mb-1.5">
              封面图 URL
            </label>
            <input
              type="text"
              value={cover}
              onChange={(e) => setCover(e.target.value)}
              className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-text focus:outline-none focus:border-primary transition-colors"
              placeholder="https://..."
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-text-muted mb-1.5">标签</label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => toggleTag(tag.id)}
                className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                  selectedTagIds.includes(tag.id)
                    ? "bg-secondary text-background border-secondary"
                    : "bg-background text-text-muted border-border hover:border-secondary"
                }`}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface rounded-xl border border-border p-6">
          <label className="block text-sm text-text-muted mb-3">
            Markdown 内容
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-[60vh] px-4 py-3 bg-background border border-border rounded-lg text-text font-mono text-sm focus:outline-none focus:border-primary transition-colors resize-none"
            placeholder="# 标题\n\n开始编写 Markdown 内容..."
          />
        </div>

        {showPreview && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-surface rounded-xl border border-border p-6"
          >
            <label className="block text-sm text-text-muted mb-3">预览</label>
            <div className="h-[60vh] overflow-auto">
              <MarkdownRenderer content={content} />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
